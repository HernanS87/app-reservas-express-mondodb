import { HydratedDocument, Types } from "mongoose";
import { Reserva, ReservaModelType } from "../model/entity/reserva";

export class ReservaRepository {
  getAll(): Promise<HydratedDocument<ReservaModelType>[]> {
    return Reserva.find().populate("user").exec();
  }

  getById(id: Types.ObjectId): Promise<HydratedDocument<ReservaModelType> | null> {
    return Reserva.findById(id).populate("user").exec();
  }

  save(reservaDto: ReservaModelType): Promise<HydratedDocument<ReservaModelType>> {
    const newReserva = new Reserva(reservaDto);
    return newReserva.save();
  }

  delete(id: Types.ObjectId): Promise<HydratedDocument<ReservaModelType> | null> {
    return Reserva.findByIdAndDelete(id).exec();
  }

  update(id: string, updateData: Partial<ReservaModelType>): Promise<HydratedDocument<ReservaModelType> | null> {
    return Reserva.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  getReservasByPeriodoAndTurno(fechaInicio: Date, fechaFin: Date, turno: string): Promise<HydratedDocument<ReservaModelType>[]> {
    return Reserva.find({
      fecha: { $gte: fechaInicio, $lte: fechaFin },
      turno,
    });
  }

  getReservasByFechaAndTurno(fecha: Date, turno: string): Promise<HydratedDocument<ReservaModelType>[]> {
    return Reserva.find({ fecha, turno });
  }
}

// ------------ ¿Por qué usamos HydratedDocument? -------------
// Utilizamos `HydratedDocument<ReservaModelType>` como tipo de retorno para representar instancias completas de documentos Mongoose.
// `HydratedDocument` es un tipo proporcionado por Mongoose que extiende `ReservaModelType` y añade propiedades y métodos
// específicos de Mongoose, como `save`, `populate`, y `_id`, permitiendo que los documentos tengan funcionalidades
// adicionales para la manipulación de datos en la base de datos. Esto es útil cuando necesitamos acceder a estos
// métodos en capas superiores, manteniendo la estructura y los datos definidos en `ReservaModelType`.

// ------------ ¿Por qué usamos exec()? -------------
// En Mongoose, métodos como find y update devuelven un Query, que no es una promesa directa.
// Para convertir el Query en una promesa que soporte async/await o .then(), usamos .exec().
