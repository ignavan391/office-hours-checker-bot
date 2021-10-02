import { Context } from 'telegraf';
import { User } from './user.type';

export interface UserContext extends Context {
    user: User
}

export type Ctx = UserContext & { match: RegExpExecArray };
export type Handler = (dto: Ctx) => Promise<string>;
