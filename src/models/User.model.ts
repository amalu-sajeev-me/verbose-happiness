import { Prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { IUserEntity } from "@types-local/IUserEntity.type";

@pre<UserEntity>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})
class UserEntity implements IUserEntity {
    @Prop()
    public firstName!: string;
    @Prop()
    public lastName!: string;
    @Prop()
    public email!: string;
    @Prop()
    public password!: string;

    public isValidPassword = async (password: string) => {
        const compare = await bcrypt.compare(password, this.password);
        return !!compare;
    }
}

export const UserModel = getModelForClass(UserEntity);