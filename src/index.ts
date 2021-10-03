import { Telegraf } from 'telegraf';
import { UserMiddleware } from './common/middlewares/user.middleware';
import config from './config';
import { DayController } from './controllers/day.controller';
import { HelpController } from './controllers/help.controller';
import { createOrmConnection } from './database';
import { UserContext } from './types/ctx.type';
import { MenuTemplate }  from 'telegraf-inline-menu'
(async () => {
  const bot = new Telegraf<UserContext>(config.botToken);
  await createOrmConnection();

  const dayController = new DayController();
  const helpController = new HelpController();

  bot.use(UserMiddleware);
  bot.hears('/start', (ctx) => helpController.start(ctx));
  bot.hears(/get\s(\d{2})\/((\d{2})|(\d{1}))/, (ctx) => dayController.getDay(ctx));

  bot.hears(/set\s(\d{2})\/((\d{2})|(\d{1}))\s(([0-5][0-9]m)|([0-9]h))$/, (ctx)=> dayController.setDay(ctx))
  // bot.hears(/add\s(\d{2})\/((\d{2})|(\d{1}))\s(10|11|12|[1-9]):([0-5][0-9])$/)
  // bot.command('show_all_info'
  //   bot.hears(/set\s(\d{2})\/((\d{2})|(\d{1}))\s(10|11|12|[1-9]):([0-5][0-9])$/, (ctx)=> {ctx.match[0]})
  bot.launch();
})();
