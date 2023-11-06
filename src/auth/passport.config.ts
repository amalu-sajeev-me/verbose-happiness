import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

import { UserModel } from "@models/User.model";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class PassportConfig{
    private readonly _passport = passport;
    private readonly _userModel = UserModel;


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