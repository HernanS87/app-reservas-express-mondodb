import { Types } from "mongoose";

interface IBaseId {
  id: Types.ObjectId;
}

export interface ILoginTokenPayload extends IBaseId {
  loginToken: string;
}

export interface IAuthTokenPayload extends IBaseId {
  userName: string;
}
