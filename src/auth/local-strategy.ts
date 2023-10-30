import { IStrategyOptions, Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import { UserModel } from '../models/User.model';
import bcrypt from 'bcrypt';

const strategyOptions: IStrategyOptions = {
    session: false
};

const verify: VerifyFunction = async (username, password, done) => {
    try {
        const user = await UserModel.findOne({ email: username });
        if (!user) return done(null, false);
        const validUser = await bcrypt.compare(password, user.password);
        if (!validUser) return done(null, false);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

export const localStrategy = new LocalStrategy(strategyOptions, verify);