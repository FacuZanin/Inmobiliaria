// backend\src\modules\user\domain\capabilities\property-publishers.ts
import { UserType } from '@shared/contracts/enums/user-type.enum';

export type UserTypeCapabilities = {
  isProfessional: boolean;
  canRequestProfessionalProfile: boolean;
  canPublishProperties: boolean;
  canCreateOperations: boolean;
  requiresAgencyOnApproval: boolean;
};

export const USER_TYPE_CAPABILITIES: Record<UserType, UserTypeCapabilities> = {
  [UserType.PARTICULAR]: {
    isProfessional: false,
    canRequestProfessionalProfile: true,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.INMOBILIARIA]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: true,
  },
  [UserType.CORREDOR]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.MARTILLERO]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.BROKER]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.DESARROLLADOR]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.CONSTRUCTOR]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.ARQUITECTO]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: true,
    canCreateOperations: true,
    requiresAgencyOnApproval: false,
  },
  [UserType.DECORADOR]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: false,
    canCreateOperations: false,
    requiresAgencyOnApproval: false,
  },
  [UserType.TASADOR]: {
    isProfessional: true,
    canRequestProfessionalProfile: false,
    canPublishProperties: false,
    canCreateOperations: false,
    requiresAgencyOnApproval: false,
  },
};

export const PROFESSIONAL_USER_TYPES = (
  Object.entries(USER_TYPE_CAPABILITIES) as [UserType, UserTypeCapabilities][]
)
  .filter(([, capabilities]) => capabilities.isProfessional)
  .map(([type]) => type);

export const AGENCY_USER_TYPES = (
  Object.entries(USER_TYPE_CAPABILITIES) as [UserType, UserTypeCapabilities][]
)
  .filter(([, capabilities]) => capabilities.requiresAgencyOnApproval)
  .map(([type]) => type);

export const PROPERTY_PUBLISHERS = (
  Object.entries(USER_TYPE_CAPABILITIES) as [UserType, UserTypeCapabilities][]
)
  .filter(([, capabilities]) => capabilities.canPublishProperties)
  .map(([type]) => type);

export const OPERATION_CREATORS = (
  Object.entries(USER_TYPE_CAPABILITIES) as [UserType, UserTypeCapabilities][]
)
  .filter(([, capabilities]) => capabilities.canCreateOperations)
  .map(([type]) => type);

export function getUserTypeCapabilities(type: UserType): UserTypeCapabilities {
  return USER_TYPE_CAPABILITIES[type];
}
