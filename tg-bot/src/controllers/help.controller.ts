import { Ctx } from '../types/ctx.type';

export class HelpController {
  async start(ctx: Ctx): Promise<void> {
    try {
      const user = ctx.user;
      ctx.reply(`Welcome ${user.name} 🐱`);
    } catch (e: any) {
      ctx.reply(e);
    }
  }
}
