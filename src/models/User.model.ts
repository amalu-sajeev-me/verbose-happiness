import { Prop, getModelForClass } from '@typegoose/typegoose';
import { IUserEntity } from "../types/IUserEntity.type";

class UserEntity implements IUserEntity {
    @Prop()
    public firstName!: string;
    @Prop()
    public lastName!: string;
    @Prop()
    public email!: string;
    @Prop()
    public password!: string;
}

export const UserModel = getModelForClass(UserEntity);