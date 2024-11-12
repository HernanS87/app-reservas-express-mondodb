import { DiaSemana } from "../enum/diaSemanaEnum";

export function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Establecer a las 00:00:00.000
  return start;
}

export function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // Establecer a las 23:59:59.999
  return end;
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
