import { TipoError } from "../../enum/tipoErrorEnum";

export interface IMensajeError {
  severidad: TipoError;
  descripcion: string;
  cod?: number;
}

export class MensajeErrorDto implements IMensajeError {
  constructor(
    public severidad: TipoError,
    public descripcion: string,
    public cod?: number
  ) {}
}
