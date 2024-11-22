import { z } from "zod";
import { TipoTurno } from "../../enum/tipoTurnoEnum";
import { convertirAFechaLocal } from "../../util/dateUtil";
import { isAfter } from "date-fns";

// Esquema para validar que la fecha tenga el formato "YYYY-MM-DD"
const fechaSchema = z
  .string()
  .min(1, "La fecha es obligatoria.")
  .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
    message: "El parámetro fecha debe ser una fecha válida en formato YYYY-MM-DD.",
  })
  .refine((val) => isAfter(convertirAFechaLocal(val), new Date()), {
    message: "La fecha debe ser mayor al día de hoy.",
  })
  .transform((val) => convertirAFechaLocal(val));

// Esquema para turno y personas con validación adicional para evitar valores vacíos
const turnoPersonasSchema = z.object({
  turno: z
    .string()
    .min(1, "El turno es obligatorio.")
    .refine((val) => Object.values(TipoTurno).includes(val.toLowerCase() as TipoTurno), {
      message: "El valor de 'turno' no es válido, debe ser 'cena' o 'almuerzo'.",
    }),
  personas: z
    .string()
    .min(1, "El numero de personas es obligatorio.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10, {
      message: "El parámetro 'personas' debe ser un número mayor que 0 y no mayor a 10.",
    })
    .transform((val) => Number(val)),
});

// Esquema combinado para fecha, turno y personas
const turnoPersonasFechaSchema = turnoPersonasSchema.extend({
  fecha: fechaSchema,
});

export const validateTurnoPersonas = (query: any) => turnoPersonasSchema.safeParseAsync(query);

export const validateTurnoPersonasFecha = (query: any) => turnoPersonasFechaSchema.safeParseAsync(query);
