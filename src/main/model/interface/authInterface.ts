import { Types } from "mongoose";
import { UserModelType } from "../entity/user";

interface IBaseId {
  id: Types.ObjectId;
}

export interface ILoginTokenPayload extends IBaseId {
  loginToken: string;
}

export interface IAuthTokenPayload extends IBaseId {
  userName: string;
}

export interface IAuthUserAndToken {
  jwtToken: string;
  user: UserModelType;
}
