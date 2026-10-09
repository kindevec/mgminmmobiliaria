'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Client,
  Appointment,
  LegalFile,
  SystemDocument,
  ActivityLog,
  SystemNotification,
  LegalDocRequirement,
} from '@/src/data/adminTypes';
import { useProperties } from './PropertyContext';

const CLIENTS_STORAGE_KEY = 'mgm_admin_clients_v1';
const APPOINTMENTS_STORAGE_KEY = 'mgm_admin_appointments_v1';
const LEGAL_FILES_STORAGE_KEY = 'mgm_admin_legal_files_v1';
const DOCUMENTS_STORAGE_KEY = 'mgm_admin_documents_v1';
const ACTIVITY_STORAGE_KEY = 'mgm_admin_activity_v1';
const NOTIFICATIONS_STORAGE_KEY = 'mgm_admin_notifications_v1';

const DEFAULT_REQUIRED_DOCS = [
  'Escritura Pública Notariada',
  'Certificado de Gravamen Actualizado',
  'Planimetría / Plano Aprobado',
  'Línea de Fábrica / Certificado de Uso de Suelo',
  'Cédula y Papeleta de Votación del Propietario',
];

interface AdminDataContextType {
  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (app: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  markAppointmentStatus: (id: string, status: Appointment['status']) => void;

  // Legal Files
  legalFiles: LegalFile[];
  updateLegalFile: (id: string, updates: Partial<LegalFile>) => void;
  toggleLegalDocStatus: (fileId: string, docId: string, received: boolean, url?: string) => void;

  // Documents
  documents: SystemDocument[];
  addDocument: (doc: Omit<SystemDocument, 'id' | 'uploadedAt'>) => SystemDocument;
  deleteDocument: (id: string) => void;

  // Activity & Notifications
  activityLogs: ActivityLog[];
  logActivity: (type: ActivityLog['type'], title: string, description: string) => void;
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { properties } = useProperties();

  // 1. CLIENTS STATE
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'cli-001',
        name: 'Dra. Elena Ramos',
        phone: '0987654321',
        email: 'elena.ramos@outlook.com',
        interestedPropertyIds: ['prop-c-279'],
        interestedPropertyTitles: ['Lote Esquinero Premium Miravalle'],
        status: 'Contactado',
        notes: 'Interesada en crédito directo a 36 meses. Desea visitar el terreno en la mañana.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'cli-002',
        name: 'Ing. Carlos Mendoza',
        phone: '0991234567',
        email: 'carlos.mendoza@gmail.com',
        interestedPropertyIds: ['prop-mt-023'],
        interestedPropertyTitles: ['Casa con Local Comercial en Manta'],
        status: 'En negociación',
        notes: 'Revisando planos y propuesta comercial de pago inicial. Quiere verificar permisos de construcción.',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: 'cli-003',
        name: 'Arq. Mateo Silva',
        phone: '0994433221',
        email: 'mateo.silva@arquitectura.ec',
        interestedPropertyIds: ['prop-jm-104'],
        interestedPropertyTitles: ['Quinta Campestre Jerusalén'],
        status: 'Nuevo',
        notes: 'Contactó por WhatsApp solicitando ficha técnica y ubicación satelital.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
  });

  // 2. APPOINTMENTS STATE
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    return [
      {
        id: 'app-001',
        clientId: 'cli-001',
        clientName: 'Dra. Elena Ramos',
        clientPhone: '0987654321',
        propertyId: 'prop-c-279',
        propertyTitle: 'Lote Esquinero Premium Miravalle',
        date: tomorrowStr,
        time: '10:30',
        status: 'Confirmada',
        notes: 'Recorrido presencial por la manzana central y punto de acometida de agua.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'app-002',
        clientId: 'cli-002',
        clientName: 'Ing. Carlos Mendoza',
        clientPhone: '0991234567',
        propertyId: 'prop-mt-023',
        propertyTitle: 'Casa con Local Comercial en Manta',
        date: todayStr,
        time: '16:00',
        status: 'Pendiente',
        notes: 'Reunión en obra para inspeccionar el local comercial y área posterior.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
  });

  // 3. LEGAL FILES STATE (Integrado con propiedades existentes)
  const [legalFiles, setLegalFiles] = useState<LegalFile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LEGAL_FILES_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // 4. DOCUMENTS STATE (Centralizado, integrando PDFs ya vinculados)
  const [documents, setDocuments] = useState<SystemDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'doc-seed-1',
        name: 'Dossier Institucional MGM 2026',
        type: 'Ficha Técnica',
        propertyCode: 'GENERAL',
        propertyTitle: 'Sociedad Civil MGM Inmobiliaria',
        url: '/docs/MGM_Inmobiliaria_Dossier_Institucional_2026.pdf',
        size: '1.4 MB',
        uploadedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        status: 'Vigente',
      },
      {
        id: 'doc-seed-2',
        name: 'Ficha Técnica Oficial MT24-023',
        type: 'Ficha Técnica',
        propertyId: 'prop-mt-023',
        propertyCode: 'MT24-023',
        propertyTitle: 'Casa con Local Comercial en Manta',
        url: '/properties/MT24-023/ficha-tecnica-MT24-023.pdf',
        size: '890 KB',
        uploadedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        status: 'Vigente',
      },
      {
        id: 'doc-seed-3',
        name: 'Ficha Técnica Oficial C24-279',
        type: 'Ficha Técnica',
        propertyId: 'prop-c-279',
        propertyCode: 'C24-279',
        propertyTitle: 'Lote Esquinero Premium Miravalle',
        url: '/properties/C24-279/ficha-tecnica-C24-279.pdf',
        size: '1.1 MB',
        uploadedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        status: 'Vigente',
      },
    ];
  });

  // 5. ACTIVITY LOGS
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'act-1',
        type: 'appointment',
        title: 'Nueva cita agendada',
        description: 'Dra. Elena Ramos agendó visita para mañana a las 10:30 AM en Miravalle.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
      {
        id: 'act-2',
        type: 'client',
        title: 'Nuevo cliente registrado',
        description: 'Arq. Mateo Silva registrado con interés en Jerusalén · Malchinguí.',
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        id: 'act-3',
        type: 'property',
        title: 'Propiedad actualizada',
        description: 'Se actualizaron especificaciones técnicas de MT24-023 en Manta.',
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        id: 'act-4',
        type: 'document',
        title: 'Documento legal agregado',
        description: 'Se indexó la Ficha Técnica oficial de C24-279.',
        timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      },
    ];
  });

  // 6. NOTIFICATIONS
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'notif-1',
        type: 'warning',
        title: 'Expediente con documentos pendientes',
        message: 'El expediente de MT24-023 tiene documentos pendientes de validación.',
        targetTab: 'legalFiles',
        read: false,
        createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      },
      {
        id: 'notif-2',
        type: 'info',
        title: 'Próxima visita programada',
        message: 'Tienes una visita programada con Dra. Elena Ramos para mañana 10:30.',
        targetTab: 'appointments',
        read: false,
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
    ];
  });

  // Sincronizar automáticamente legalFiles con las propiedades actuales
  useEffect(() => {
    if (properties.length === 0) return;

    setLegalFiles((prevFiles) => {
      const existingMap = new Map(prevFiles.map((f) => [f.propertyId, f]));
      let hasChanges = false;

      const syncedFiles: LegalFile[] = properties.map((prop) => {
        const existing = existingMap.get(prop.id);
        if (existing) {
          // Mantener y actualizar título o código si cambiaron
          if (existing.propertyTitle !== prop.name || existing.propertyCode !== prop.code) {
            hasChanges = true;
            return {
              ...existing,
              propertyTitle: prop.name,
              propertyCode: prop.code,
            };
          }
          return existing;
        }

        hasChanges = true;
        // Crear nuevo expediente para esta propiedad integrando sus PDFs existentes
        const hasPdf = Boolean(prop.pdfUrl);
        const docsRequirements: LegalDocRequirement[] = DEFAULT_REQUIRED_DOCS.map((docName, idx) => {
          // Marcar plano/ficha como recibido si ya tiene PDF
          const isFichaOrPlano = docName.toLowerCase().includes('plan') || docName.toLowerCase().includes('ficha');
          const isReceived = isFichaOrPlano && hasPdf;
          return {
            id: `req-${prop.id}-${idx}`,
            name: docName,
            required: true,
            received: isReceived,
            fileUrl: isReceived ? prop.pdfUrl : undefined,
            uploadedAt: isReceived ? new Date().toISOString() : undefined,
          };
        });

        const pendingCount = docsRequirements.filter((r) => r.required && !r.received).length;
        const initialStatus: LegalFile['status'] =
          pendingCount === 0
            ? 'Completo'
            : pendingCount < docsRequirements.length
            ? 'En revisión'
            : 'Pendiente';

        return {
          id: `leg-${prop.id}`,
          propertyId: prop.id,
          propertyCode: prop.code,
          propertyTitle: prop.name,
          status: initialStatus,
          requiredDocs: docsRequirements,
          notes: prop.registryStatus
            ? `Estado notarial actual: ${prop.registryStatus}`
            : 'Expediente abierto para regularización notarial.',
          updatedAt: new Date().toISOString(),
        };
      });

      if (hasChanges || prevFiles.length === 0) {
        try {
          localStorage.setItem(LEGAL_FILES_STORAGE_KEY, JSON.stringify(syncedFiles));
        } catch (e) {
          console.error(e);
        }
        return syncedFiles;
      }
      return prevFiles;
    });
  }, [properties]);

  // Sync to LocalStorage
  const saveClients = (data: Client[]) => {
    setClients(data);
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const saveAppointments = (data: Appointment[]) => {
    setAppointments(data);
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const saveLegalFiles = (data: LegalFile[]) => {
    setLegalFiles(data);
    try {
      localStorage.setItem(LEGAL_FILES_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const saveDocuments = (data: SystemDocument[]) => {
    setDocuments(data);
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const logActivity = (type: ActivityLog['type'], title: string, description: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...activityLogs].slice(0, 30);
    setActivityLogs(updated);
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // CLIENT CRUD
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...data,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newClient, ...clients];
    saveClients(updated);
    logActivity('client', 'Nuevo cliente registrado', `${newClient.name} fue registrado exitosamente.`);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    saveClients(updated);
    logActivity('client', 'Cliente actualizado', `Se actualizaron los datos del cliente.`);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    saveClients(updated);
  };

  // APPOINTMENT CRUD
  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApp: Appointment = {
      ...data,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newApp, ...appointments];
    saveAppointments(updated);
    logActivity(
      'appointment',
      'Nueva cita agendada',
      `Visita programada con ${newApp.clientName} para ${newApp.date} a las ${newApp.time}.`
    );
    return newApp;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, ...updates } : a));
    saveAppointments(updated);
    logActivity('appointment', 'Cita actualizada', `Se modificó la cita agendada.`);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    saveAppointments(updated);
  };

  const markAppointmentStatus = (id: string, status: Appointment['status']) => {
    const target = appointments.find((a) => a.id === id);
    if (!target) return;
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    saveAppointments(updated);
    logActivity(
      'appointment',
      `Cita marcada como ${status.toLowerCase()}`,
      `La visita de ${target.clientName} fue marcada como ${status}.`
    );
  };

  // LEGAL FILES ACTIONS
  const updateLegalFile = (id: string, updates: Partial<LegalFile>) => {
    const updated = legalFiles.map((lf) => (lf.id === id ? { ...lf, ...updates, updatedAt: new Date().toISOString() } : lf));
    saveLegalFiles(updated);
    logActivity('legal', 'Expediente actualizado', `Se actualizó el estado del expediente.`);
  };

  const toggleLegalDocStatus = (fileId: string, docId: string, received: boolean, url?: string) => {
    const updated = legalFiles.map((lf) => {
      if (lf.id !== fileId) return lf;
      const updatedDocs = lf.requiredDocs.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            received,
            fileUrl: received ? url || doc.fileUrl : undefined,
            uploadedAt: received ? new Date().toISOString() : undefined,
          };
        }
        return doc;
      });

      // Recalcular estado automático
      const pending = updatedDocs.filter((d) => d.required && !d.received).length;
      const autoStatus: LegalFile['status'] =
        pending === 0
          ? 'Completo'
          : pending < updatedDocs.length
          ? 'En revisión'
          : 'Pendiente';

      return {
        ...lf,
        requiredDocs: updatedDocs,
        status: autoStatus,
        updatedAt: new Date().toISOString(),
      };
    });
    saveLegalFiles(updated);
  };

  // DOCUMENTS ACTIONS
  const addDocument = (doc: Omit<SystemDocument, 'id' | 'uploadedAt'>): SystemDocument => {
    const newDoc: SystemDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [newDoc, ...documents];
    saveDocuments(updated);
    logActivity('document', 'Documento agregado', `Se subió el documento ${newDoc.name}.`);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearNotifications = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        markAppointmentStatus,
        legalFiles,
        updateLegalFile,
        toggleLegalDocStatus,
        documents,
        addDocument,
        deleteDocument,
        activityLogs,
        logActivity,
        notifications,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
