import { z } from "zod";
import { TipoTurno } from "../../enum/tipoTurnoEnum";
import { HorasCena } from "../../enum/horasCenaEnum";
import { HorasAlmuerzo } from "../../enum/horasAlmuerzoEnum";
import { convertirAFechaLocal } from "../../util/dateUtil";
import { isAfter } from "date-fns";
import { idSchema } from "./idValidation";

const validHours = [...Object.values(HorasCena), ...Object.values(HorasAlmuerzo)];

// Esquema Zod para validar los datos de una reserva
const reservaSchema = z
  .object({
    cantidadPersonas: z
      .number()
      .min(1, { message: "Debe haber al menos 1 persona." })
      .max(10, { message: "No puede haber más de 10 personas." }),

    // Validación de fecha
    fecha: z
      .string()
      .min(1, "La fecha es obligatoria.")
      .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val)), {
        message: "El parámetro fecha debe ser una fecha válida en formato YYYY-MM-DD.",
      })
      .refine((val) => isAfter(convertirAFechaLocal(val), new Date()), {
        message: "La fecha debe ser mayor al día de hoy.",
      })
      .transform((val) => convertirAFechaLocal(val)),

    turno: z.string().refine((val) => Object.values(TipoTurno).includes(val.toLowerCase() as TipoTurno), {
      message: "El valor de 'turno' no es válido, debe ser 'cena' o 'almuerzo'.",
    }), // Validación para que "turno" solo pueda ser "cena" o "almuerzo"

    hora: z.string().refine((value) => validHours.includes(value as HorasAlmuerzo | HorasCena), {
      message: "La hora elegida no es una opción válida.",
    }),
  })
  .extend({
    user: idSchema,
  });

// Inferir el tipo de TypeScript a partir del esquema de Zod
export type ReservaValidation = z.infer<typeof reservaSchema>;

export const validateReserva = (reserva: ReservaValidation) => reservaSchema.safeParseAsync(reserva);
