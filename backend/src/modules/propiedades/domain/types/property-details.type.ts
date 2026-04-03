// backend\src\modules\propiedades\domain\types\property-details.type.ts
import { CasaDetails } from '../details/casa.details';
import { DepartamentoDetails } from '../details/departamento.details';
import { LoteDetails } from '../details/lote.details';
import { LocalDetails } from '../details/local.details';
import { OficinaDetails } from '../details/oficina.details';
import { CampoDetails } from '../details/campo.details';
import { PHDetails } from '../details/ph.details';
import { PozoDetails } from '../details/pozo.details';
import { PropiedadTipo } from '@shared/enums/propiedad-tipo.enum';

/**
 * Mapa de detalles por tipo de propiedad
 */
export type PropertyDetailsByType = {
  [PropiedadTipo.CASA]: CasaDetails;
  [PropiedadTipo.DEPARTAMENTO]: DepartamentoDetails;
  [PropiedadTipo.LOTE]: LoteDetails;
  [PropiedadTipo.LOCAL]: LocalDetails;
  [PropiedadTipo.OFICINA]: OficinaDetails;
  [PropiedadTipo.CAMPO]: CampoDetails;
  [PropiedadTipo.PH]: PHDetails;
  [PropiedadTipo.POZO]: PozoDetails;
};
