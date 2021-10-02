import { Context } from 'telegraf';

export type Ctx = Context & { match: RegExpExecArray };
export type Handler = (dto: Ctx) => Promise<string>;
