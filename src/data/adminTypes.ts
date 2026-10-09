export type PropertyStatus = 'Disponible' | 'En Reserva' | 'Vendido' | 'Inactiva';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedPropertyIds: string[]; // IDs de propiedades de interés
  interestedPropertyTitles?: string[];
  notes?: string;
  status: 'Nuevo' | 'Contactado' | 'En negociación' | 'Cerrado' | 'No interesado';
  createdAt: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  propertyId: string;
  propertyTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: 'Pendiente' | 'Confirmada' | 'Realizada' | 'Cancelada';
  createdAt: string;
}

export type LegalDocRequirement = {
  id: string;
  name: string;
  required: boolean;
  received: boolean;
  fileUrl?: string;
  uploadedAt?: string;
};

export interface LegalFile {
  id: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  status: 'Pendiente' | 'En revisión' | 'Completo' | 'Con observaciones';
  requiredDocs: LegalDocRequirement[];
  notes?: string;
  updatedAt: string;
}

export type DocumentType =
  | 'Escritura'
  | 'Contrato'
  | 'Plano'
  | 'Cédula'
  | 'Certificado'
  | 'Ficha Técnica'
  | 'Otro';

export interface SystemDocument {
  id: string;
  name: string;
  type: DocumentType;
  propertyId?: string;
  propertyCode?: string;
  propertyTitle?: string;
  legalFileId?: string;
  url: string;
  size?: string;
  uploadedAt: string;
  status: 'Vigente' | 'En revisión' | 'Archivado';
}

export interface ActivityLog {
  id: string;
  type: 'property' | 'client' | 'appointment' | 'document' | 'legal';
  title: string;
  description: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  targetTab?: string;
  read: boolean;
  createdAt: string;
}
