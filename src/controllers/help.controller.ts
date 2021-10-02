import { Ctx, Handler } from '../types/ctx.type';
import { UserDto } from '../types/user.type';
import { UserController } from './user.controller';

export class HelpController {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  async start(ctx: Ctx): Promise<void> {
    if (!ctx.from) {
      ctx.reply('Информация о получателе не найдена');
      return;
    }
    const dto: UserDto = {
      name: ctx.from.username,
      telegramId: ctx.from.id,
    };
    try {
      const user = await this.userController.findOrSaveUser(dto);
      ctx.reply(`Welcome ${user.name}`);
    } catch (e: any) {
      ctx.reply(e);
    }
  }
}
