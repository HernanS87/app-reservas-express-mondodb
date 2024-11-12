export enum TipoTurno {
  CENA = "cena",
  ALMUERZO = "almuerzo"
}

export function getTipoTurno(value?: string): TipoTurno | undefined {
  value = value?.toLocaleLowerCase();
  if (Object.values(TipoTurno).includes(value as TipoTurno)) {
    return value as TipoTurno;
  }
  return undefined;
}