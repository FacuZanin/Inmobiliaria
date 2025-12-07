export class OperacionDatesHelper {
  static toDateOrNull(val?: string): Date | null {
    return val ? new Date(val) : null;
  }

  static isExpired(fechaFinalizacion?: Date): boolean {
    if (!fechaFinalizacion) return false;
    return fechaFinalizacion.getTime() < Date.now();
  }
}
