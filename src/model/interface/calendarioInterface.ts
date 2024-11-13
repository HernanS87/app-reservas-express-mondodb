import { Types } from "mongoose";
import { HorasAlmuerzo } from "../../enum/horasAlmuerzoEnum";
import { HorasCena } from "../../enum/horasCenaEnum";
import { TipoDisponibilidad } from "../../enum/tipoDisponibilidadEnum";

export interface IDisponibilidadDia {
  fecha: Date;
  disponible: boolean;
  tipo: TipoDisponibilidad;
}

type HorasAlmuerzoCena = HorasAlmuerzo | HorasCena;

export interface IHorarios {
  hora: HorasAlmuerzoCena;
  disponible: boolean;
}

export interface IDisponibilidadDiaHorarios extends IDisponibilidadDia {
  horarios?: IHorarios[];
}

export interface IMesasOcupadasPorTurnoYHorario {
  hora: string;
  mesasOcupadasId: Types.ObjectId[];
}
