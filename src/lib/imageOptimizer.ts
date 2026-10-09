import { supabase } from './supabase';

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1, default 0.82
}

export interface OptimizationResult {
  file: File;
  originalSizeKB: number;
  optimizedSizeKB: number;
  savingsPercent: number;
}

/**
 * Convierte un archivo de imagen a formato WebP optimizado en el navegador
 * antes de enviarlo a Supabase Storage o al servidor.
 * Reduce drásticamente el peso (hasta 70-85% de ahorro) evitando agotar la cuota de almacenamiento.
 */
export async function convertImageToWebP(
  file: File,
  options: OptimizationOptions = {}
): Promise<File> {
  const { maxWidth = 1440, maxHeight = 1440, quality = 0.80 } = options;

  // Si no es imagen, retornar tal cual
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calcular dimensiones proporcionales
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Fondo neutro
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Renderizado de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanBaseName = file.name
              .substring(0, file.name.lastIndexOf('.'))
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '-');
            const newFileName = `${cleanBaseName || 'inmueble'}.webp`;

            const optimizedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Optimiza una imagen a WebP y la sube al bucket 'properties' de Supabase Storage.
 * Retorna la URL pública directa para guardar en la base de datos Postgres.
 */
export async function uploadOptimizedImage(
  file: File,
  propertyCode: string = 'general'
): Promise<string> {
  const optimizedWebpFile = await convertImageToWebP(file);
  const cleanCode = propertyCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const filePath = `properties/${cleanCode}/${timestamp}-${randomSuffix}.webp`;

  const { error } = await supabase.storage
    .from('properties')
    .upload(filePath, optimizedWebpFile, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 año de caché CDN
      upsert: true,
    });

  if (error) {
    console.error('Error subiendo imagen a Supabase Storage:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('properties')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Sube un documento (PDF, Ficha Técnica) al bucket de Supabase Storage.
 * Si el usuario adjunta una imagen como documento, la comprime a WebP automáticamente.
 */
export async function uploadPropertyDocument(
  file: File,
  propertyCode: string = 'general',
  customTitle?: string
): Promise<{ title: string; url: string; size: string; description: string }> {
  const cleanCode = propertyCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
  const timestamp = Date.now();
  
  // Si el archivo es una imagen, comprimirla a WebP
  let fileToUpload = file;
  let contentType = file.type || 'application/pdf';
  let extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (file.type.startsWith('image/')) {
    fileToUpload = await convertImageToWebP(file);
    contentType = 'image/webp';
    extension = '.webp';
  }

  const safeBase = file.name
    .substring(0, file.name.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `documents/${cleanCode}/${timestamp}-${safeBase}${extension}`;

  const { error } = await supabase.storage
    .from('properties')
    .upload(filePath, fileToUpload, {
      contentType,
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) {
    console.error('Error subiendo documento a Supabase Storage:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('properties')
    .getPublicUrl(filePath);

  const sizeKb = Math.round(fileToUpload.size / 1024);
  const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  return {
    title: customTitle || file.name.replace(/\.[^/.]+$/, ''),
    url: publicUrlData.publicUrl,
    size: sizeFormatted,
    description: 'Documento oficial optimizado cargado al expediente.',
  };
}

/**
 * Elimina automáticamente de Supabase Storage todas las fotografías WebP
 * y documentos PDFs vinculados a una propiedad al momento de ser borrada.
 * Previene el almacenamiento de archivos huérfanos y conserva la cuota del plan gratuito.
 */
export async function deletePropertyStorageFiles(prop: {
  code: string;
  image?: string;
  gallery?: string[];
  pdfUrl?: string;
  documents?: { url: string }[];
}): Promise<void> {
  try {
    const cleanCode = prop.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
    const filesToDelete: string[] = [];

    // 1. Listar archivos existentes en la carpeta de la propiedad
    const [propsFolder, docsFolder] = await Promise.all([
      supabase.storage.from('properties').list(`properties/${cleanCode}`),
      supabase.storage.from('properties').list(`documents/${cleanCode}`),
    ]);

    if (propsFolder.data) {
      propsFolder.data.forEach((f) => {
        if (f.name) filesToDelete.push(`properties/${cleanCode}/${f.name}`);
      });
    }

    if (docsFolder.data) {
      docsFolder.data.forEach((f) => {
        if (f.name) filesToDelete.push(`documents/${cleanCode}/${f.name}`);
      });
    }

    // 2. Extraer rutas de Storage a partir de URLs registradas
    const allUrls = [
      prop.image,
      ...(prop.gallery || []),
      ...(prop.documents?.map((d) => d.url) || []),
      prop.pdfUrl,
    ].filter(Boolean) as string[];

    const marker = '/storage/v1/object/public/properties/';
    allUrls.forEach((url) => {
      if (url.includes(marker)) {
        const path = url.substring(url.indexOf(marker) + marker.length);
        if (!filesToDelete.includes(path)) {
          filesToDelete.push(path);
        }
      }
    });

    if (filesToDelete.length > 0) {
      const { error } = await supabase.storage.from('properties').remove(filesToDelete);
      if (error) {
        console.warn('Advertencia al remover archivos de Supabase Storage:', error);
      }
    }
  } catch (err) {
    console.warn('Error al limpiar archivos de Storage:', err);
  }
}

