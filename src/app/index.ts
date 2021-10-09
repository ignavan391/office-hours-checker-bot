import { Telegraf } from 'telegraf';
import logger from '../common/logger';
import { UserMiddleware } from '../common/middlewares/user.middleware';
import config from '../config';
import { DayController } from '../controllers/day.controller';
import { HelpController } from '../controllers/help.controller';
import { createOrmConnection } from '../database';
import { UserContext } from '../types/ctx.type';

export class AppModule {
  private telegramApi: Telegraf<UserContext>;
  private dayController: DayController;
  private helpController: HelpController;

  constructor() {
    this.telegramApi = new Telegraf<UserContext>(config.botToken);

    this.helpController = new HelpController();
    this.dayController = new DayController();
  }

  public async init(): Promise<void> {
    await createOrmConnection();

    this.telegramApi.use(UserMiddleware);

    this.telegramApi.hears('/start', this.helpController.start);

    this.telegramApi.hears(
      /get\s(\d{2})\/((\d{2})|(\d{1}))/,
      this.dayController.getDay,
    );
    this.telegramApi.hears(
      /set\s(\d{2})\/((\d{2})|(\d{1}))\s(([0-5][0-9]m)|([0-9]h))$/,
      this.dayController.setDay,
    );
    this.telegramApi.command('show_all_info', this.dayController.getLastDates);
    logger.info({
      level: 'info',
      message: 'Initialization'
    });
    this.telegramApi.launch();
  }
}
