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

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB límite estricto
export const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB límite estricto

/**
 * Valida la firma binaria real (magic bytes) de un archivo para mitigar
 * falsificación de extensiones o ataques de suplantación de MIME type.
 */
export async function validateFileMagicBytes(
  file: File,
  expectedKind: 'image' | 'pdf'
): Promise<{ valid: boolean; detectedMime?: string; error?: string }> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (expectedKind === 'pdf') {
      // PDF debe iniciar obligatoriamente con %PDF (0x25, 0x50, 0x44, 0x46)
      const isPdf =
        bytes[0] === 0x25 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x44 &&
        bytes[3] === 0x46;

      if (!isPdf) {
        return {
          valid: false,
          error: 'El archivo no es un documento PDF auténtico (la firma binaria no coincide con %PDF).',
        };
      }
      return { valid: true, detectedMime: 'application/pdf' };
    }

    if (expectedKind === 'image') {
      // JPEG: 0xFF, 0xD8, 0xFF
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      // PNG: 0x89, 0x50, 0x4E, 0x47
      const isPng =
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47;
      // GIF: 0x47, 0x49, 0x46
      const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
      // WebP: RIFF (bytes 0-3) y WEBP (bytes 8-11)
      const isWebP =
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50;

      if (!isJpeg && !isPng && !isGif && !isWebP) {
        return {
          valid: false,
          error: 'El archivo no es una imagen válida admitida (solo se aceptan JPEG, PNG y WebP con firma válida).',
        };
      }
      const detectedMime = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : isGif ? 'image/gif' : 'image/webp';
      return { valid: true, detectedMime };
    }

    return { valid: false, error: 'Tipo de validación no admitido.' };
  } catch (err) {
    return {
      valid: false,
      error: `Error al inspeccionar la cabecera binaria del archivo: ${err instanceof Error ? err.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Optimiza una imagen a WebP y la sube al bucket 'properties' de Supabase Storage.
 * Retorna la URL pública directa para guardar en la base de datos Postgres.
 */
export async function uploadOptimizedImage(
  file: File,
  propertyCode: string = 'general'
): Promise<string> {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo para subir.');
  }

  // 1. Límite de tamaño en cliente
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `La imagen excede el límite máximo permitido de 10 MB (pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB).`
    );
  }

  // 2. Validación de firma binaria real (magic bytes)
  const validation = await validateFileMagicBytes(file, 'image');
  if (!validation.valid) {
    throw new Error(validation.error || 'Formato de imagen inválido o manipulado.');
  }

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
    throw new Error(`Error en almacenamiento Supabase: ${error.message || 'Fallo de subida'}`);
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
  if (!file) {
    throw new Error('No se proporcionó ningún archivo de documento.');
  }

  // 1. Límite de tamaño estricto
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new Error(
      `El documento excede el límite máximo permitido de 15 MB (pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB).`
    );
  }

  // 2. Validación de firma binaria real (PDF o Imagen de respaldo)
  const pdfCheck = await validateFileMagicBytes(file, 'pdf');
  let isRealPdf = pdfCheck.valid;
  let isRealImage = false;

  if (!isRealPdf) {
    const imgCheck = await validateFileMagicBytes(file, 'image');
    if (imgCheck.valid) {
      isRealImage = true;
    }
  }

  if (!isRealPdf && !isRealImage) {
    throw new Error(
      'Archivo no admitido: Solo se permiten documentos PDF auténticos o imágenes escaneadas válidas (JPEG, PNG, WebP).'
    );
  }

  const cleanCode = propertyCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
  const timestamp = Date.now();
  
  let fileToUpload = file;
  let contentType = 'application/pdf';
  let extension = '.pdf';

  if (isRealImage) {
    fileToUpload = await convertImageToWebP(file);
    contentType = 'image/webp';
    extension = '.webp';
  }

  const safeBase = file.name
    .substring(0, file.name.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `documents/${cleanCode}/${timestamp}-${safeBase || 'doc'}${extension}`;

  const { error } = await supabase.storage
    .from('properties')
    .upload(filePath, fileToUpload, {
      contentType,
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) {
    console.error('Error subiendo documento a Supabase Storage:', error);
    throw new Error(`Error en almacenamiento Supabase: ${error.message || 'Fallo al guardar archivo'}`);
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

