import { ReservaModelType } from "../model/entity/reserva";
import { validateReserva } from "../model/validation/reservaValidation";

export class ValidacionService {
  async validarYPrepararReserva(data: any): Promise<ReservaModelType> {
    const validate = await validateReserva(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors; // Adjunta los errores al objeto de error
      throw error;
    }
    return validate.data as ReservaModelType; // Retorna los datos ya validados
  }
}
