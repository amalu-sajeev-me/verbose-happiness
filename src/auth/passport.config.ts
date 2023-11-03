import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { UserModel } from "@models/User.model";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class PassportConfig{
    private readonly _passport = passport;
    private readonly _userModel = UserModel;

    private get localStrategyForLogin() {
        return new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        }, async (username, password, done) => {
            try {
                console.log({ username, password });
                const user = await this._userModel.findOne({ email: username });
                if (!user) return done(null, false, { message: 'user not found' });
                const isValidUser = await user.isValidPassword(password);
                if (!isValidUser) return done(null, false, { message: 'wrong credentials' });
                return done(null, user, { message: 'logged in succesfully' });
            } catch (error) {
                return done(error);
            }
        })
    }

    private get jwtStrategyForLogin() {
        return new JwtStrategy({
            secretOrKey: 'secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        }, async (token, done) => {
            try {
                const existingUser = await this
                    ._userModel
                    .findOne({ email: token._doc.email }, '-password');
                if (!existingUser) return done(null, false, 'non existing user');

                return done(null, existingUser, 'logged in succesfully');
            } catch (err) {
                return done(err, false);
            }
        });
    }
    registerStrategies() {
        this._passport.use('jwt', this.jwtStrategyForLogin);
        return this;
    }

    // private verifyCallback = (
    //     payload: {_id: string}, done: DoneCallback
    // ) => {
    //     //
    // };

    public get instance() {
        return this._passport;
    }
}