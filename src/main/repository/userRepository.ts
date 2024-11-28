import { HydratedDocument, Types } from "mongoose";
import { User, UserModelType } from "../model/entity/user";

export class UserRepository {
  async findByEmailOrUserName(user: UserModelType): Promise<HydratedDocument<UserModelType> | null> {
    const conditions = [];

    if (user.email) {
      conditions.push({ email: user.email });
    }

    if (user.userName) {
      conditions.push({ userName: user.userName });
    }

    if (conditions.length === 0) {
      return null; // Retorna null si no hay criterios de búsqueda
    }

    return User.findOne({ $or: conditions });
  }

  async findByEmail(email: string): Promise<HydratedDocument<UserModelType> | null> {
    return User.findOne({ email });
  }

  async findById(id: Types.ObjectId): Promise<HydratedDocument<UserModelType> | null> {
    return User.findById(id);
  }

  async save(user: UserModelType): Promise<HydratedDocument<UserModelType>> {
    const newUser = new User(user);
    return newUser.save();
  }
}
