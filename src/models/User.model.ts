import { Prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { IUserEntity } from "@types-local/IUserEntity.type";
import { container } from 'tsyringe';
import { LoggerAdapter } from '@adapters/logger.adapter';

@pre<UserEntity>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})
class UserEntity implements IUserEntity {
    private _scream: LoggerAdapter = container.resolve(LoggerAdapter)

    @Prop()
    public firstName!: string;
    @Prop()
    public lastName!: string;
    @Prop()
    public email!: string;
    @Prop()
    public password!: string;

    public async isValidPassword(password: string) {
        try {
            const compare = await bcrypt.compare(password, this.password);
            return !!compare;
        } catch (error) {
            this._scream.error('failed to validate password hash');
        }
        return false;
    }
}

export const UserModel = getModelForClass(UserEntity);