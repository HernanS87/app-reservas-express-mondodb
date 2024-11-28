import { Types } from "mongoose";
import { IMensajeError } from "./mensajeErrorInterface";

export interface IRespAltaReserva {
  id?: Types.ObjectId;
  mensajes?: IMensajeError[];
}

export class RespAltaReservaDto implements IRespAltaReserva {
  constructor(public id?: Types.ObjectId, public mensajes?: IMensajeError[]) {}
}
