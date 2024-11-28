import { Types } from "mongoose";
import { ReservaModelType } from "../model/entity/reserva";
import { IRequestDisponibilidadDias, IRequestDisponibilidadHorariosXFecha } from "../model/interface/calendarioInterface";
import { validateTurnoPersonas, validateTurnoPersonasFecha } from "../model/validation/calendarioValidation";
import { validateReserva } from "../model/validation/reservaValidation";
import { validateId } from "../model/validation/idValidation";
import { MesaModelType } from "../model/entity/mesa";
import { validateMesa } from "../model/validation/mesaValidation";
import { UserModelType } from "../model/entity/user";
import { validateLoginUser, validateRegisterUser } from "../model/validation/authValidation";

export class ValidacionService {
  async validarRequestAltaReserva(data: any): Promise<ReservaModelType> {
    const validate = await validateReserva(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors; // Adjunta los errores al objeto de error
      throw error;
    }
    return validate.data as ReservaModelType; // Retorna los datos ya validados
  }

  async validarRequestAltaMesa(data: any): Promise<MesaModelType> {
    const validate = await validateMesa(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data;
  }

  async validarRequestDisponibilidadDias(data: any): Promise<IRequestDisponibilidadDias> {
    const validate = await validateTurnoPersonas(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data;
  }

  async validarRequestDisponibilidadHorariosXFecha(data: any): Promise<IRequestDisponibilidadHorariosXFecha> {
    const validate = await validateTurnoPersonasFecha(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data;
  }

  async validarId(data: any): Promise<Types.ObjectId> {
    const validate = await validateId(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data;
  }

  async validarRequestRegisterUser(data: any): Promise<UserModelType> {
    const validate = await validateRegisterUser(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data as UserModelType;
  }

  async validarRequestLoginUser(data: any): Promise<UserModelType> {
    const validate = await validateLoginUser(data);
    if (!validate.success) {
      const error = new Error("Errores de validación");
      (error as any).errors = validate.error.errors;
      throw error;
    }
    return validate.data as UserModelType;
  }
}
