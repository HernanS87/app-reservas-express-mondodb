import { z } from 'zod';
import { TipoTurno } from '../../enum/tipoTurnoEnum';

// Esquema Zod para validar los datos de una reserva
const reservaSchema = z.object({
  nombreCliente: z.string()
    .min(1, "El nombre del cliente es obligatorio"), // Valida que no esté vacío
  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido"), // Validación de formato de email
  cantidadPersonas: z.number()
    .min(1, { message: "Debe haber al menos 1 persona." })
    .max(10, { message: "No puede haber más de 10 personas." }),
  
  // Validación de fecha
  //Analizar si es mejor esta validacion o la que está en turnoPersonaValidation.ts
  fecha: z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
  }).refine((date) => date >= new Date(), {
    message: "La fecha debe ser en el futuro",
  }),

  turno: z.string().refine(val => Object.values(TipoTurno).includes(val.toLowerCase() as TipoTurno), {
    message: "El valor de 'turno' no es válido, debe ser 'cena' o 'almuerzo'.",
  }),  // Validación para que "turno" solo pueda ser "cena" o "almuerzo"

  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
});


// Inferir el tipo de TypeScript a partir del esquema de Zod
export type ReservaValidation = z.infer<typeof reservaSchema>;

export const validateReserva = (reserva: ReservaValidation) => reservaSchema.safeParseAsync(reserva);