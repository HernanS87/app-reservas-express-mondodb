import { DiaSemana } from "../enum/diaSemanaEnum";
import { format, toZonedTime } from "date-fns-tz";
import config from "../config/config.json";
import { startOfDay as dfnsStartOfDay, endOfDay as dfnsEndOfDay, addDays, isValid } from "date-fns";
import { es } from "date-fns/locale";

const RESTAURANT_TIME_ZONE = config.restaurantTimeZone;

/**
 * Devuelve el inicio del día para una fecha específica.
 * @param date - Fecha de entrada
 * @returns Inicio del día (00:00:00.000)
 * @throws Error si la fecha no es válida.
 */
export function startOfDay(date: Date): Date {
  if (!isValid(date)) {
    throw new Error("La fecha proporcionada no es válida.");
  }
  return dfnsStartOfDay(date);
}

/**
 * Devuelve el final del día para una fecha específica.
 * @param date - Fecha de entrada
 * @returns Final del día (23:59:59.999)
 * @throws Error si la fecha no es válida.
 */
export function endOfDay(date: Date): Date {
  if (!isValid(date)) {
    throw new Error("La fecha proporcionada no es válida.");
  }
  return dfnsEndOfDay(date);
}

export function obtenerDiaSemanaEnum(fecha: Date): DiaSemana {
  return fecha.getDay() as DiaSemana;
}

/**
 * Función para sumar o restar minutos a una hora específica (en formato HH:mm).
 * @param hora - La hora en formato "HH:mm".
 * @param minutos - La cantidad de minutos a sumar o restar.
 * @param operacion - La operación a realizar: "sumar" o "restar".
 * @returns - La nueva hora en formato "HH:mm".
 */
export function sumarORestarMinutos(hora: string, minutos: number, operacion: "sumar" | "restar" = "sumar"): string {
  const [horas, mins] = hora.split(":").map(Number);
  const fecha = new Date(0, 0, 0, horas, mins);
  const minutosPorOperacion = operacion === "sumar" ? minutos : -minutos;
  fecha.setMinutes(fecha.getMinutes() + minutosPorOperacion);
  return `${fecha.getHours().toString().padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;
}

/**
 * Función para convertir fechas a la zona horaria establecida
 * @param fecha
 * @returns La nueva fecha formateada.
 */
export function convertirAFechaLocal(fecha: string): Date {
  const zonedDate = toZonedTime(fecha, RESTAURANT_TIME_ZONE);
  return zonedDate;
}

/**
 * Devuelve el día siguiente a la fecha proporcionada.
 * @param fecha - Fecha de entrada (debe ser válida)
 * @throws Error si la fecha no es válida.
 */
export function obtenerDiaSiguiente(fecha: Date): Date {
  if (!isValid(fecha)) {
    throw new Error("La fecha proporcionada no es válida.");
  }
  return addDays(fecha, 1);
}

/**
 * Devuelve el día siguiente a la fecha proporcionada.
 * @param fecha - Fecha de entrada (debe ser válida)
 * @throws Error si la fecha no es válida.
 */
export function obtenerDiaAnterior(fecha: Date): Date {
  if (!isValid(fecha)) {
    throw new Error("La fecha proporcionada no es válida.");
  }
  return addDays(fecha, -1);
}

/**
 * Formatea una fecha en un formato amigable en español, respetando la zona horaria configurada.
 * @param fecha - Fecha a formatear
 * @returns Fecha formateada en el formato "EEEE, d 'de' MMMM 'de' yyyy".
 * @throws Error si la fecha no es válida.
 */
export function formatDateString(fecha: Date): string {
  if (!isValid(fecha)) {
    throw new Error("La fecha proporcionada no es válida.");
  }

  // Convertir la fecha a la zona horaria configurada
  const fechaLocal = toZonedTime(fecha, RESTAURANT_TIME_ZONE);

  // Formatear la fecha
  return format(fechaLocal, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
}
