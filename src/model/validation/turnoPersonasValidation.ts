import { z } from 'zod';
import { TipoTurno } from '../../enum/tipoTurnoEnum';

// Definir un esquema para los parámetros de la query
export const turnoPersonasSchema = z.object({
  turno: z.string().refine(val => Object.values(TipoTurno).includes(val.toLowerCase() as TipoTurno), {
    message: "El valor de 'turno' no es válido, debe ser 'cena' o 'almuerzo'.",
  }),  // Validación para que "turno" solo pueda ser "cena" o "almuerzo"
  personas: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10, {
    message: "El parámetro 'personas' debe ser un número mayor que 0 y no mayor a 10.",
  }),
});

export const validateTurnoPersonas = (queryParams: any) => turnoPersonasSchema.safeParseAsync(queryParams);