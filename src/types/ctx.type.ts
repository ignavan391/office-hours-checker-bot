import { Context } from 'telegraf';
import { BotException } from '../common/errors';

export type Ctx = Context & { match: RegExpExecArray };
export type Handler = (dto: Ctx) => Promise<string>;
