// 👤 USER

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export enum UserProfile {
  INQUILINO = 'INQUILINO',
  PROPIETARIO = 'PROPIETARIO',
  AGENCIA = 'AGENCIA',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}


// 📄 DOCUMENTOS

export enum DocumentoEstado {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}


// 🏠 PROPIEDADES

export enum PropiedadTipo {
  CASA = 'CASA',
  DEPARTAMENTO = 'DEPARTAMENTO',
  TERRENO = 'TERRENO',
  LOCAL = 'LOCAL',
}


// 💰 OPERACIONES

export enum OperacionTipo {
  VENTA = 'VENTA',
  ALQUILER = 'ALQUILER',
}

export enum OperacionEstado {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

export enum MedioOperacion {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA',
}


// 📊 AUDITORÍA

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum AuditEntity {
  USER = 'USER',
  PROPIEDAD = 'PROPIEDAD',
  OPERACION = 'OPERACION',
}