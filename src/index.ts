import { Telegraf } from 'telegraf';
import config from './config';
import { DayController } from './controllers/day.controller';
import { HelpController } from './controllers/help.controller';
import { createOrmConnection } from './database';

(async () => {
  const bot = new Telegraf(config.botToken);
  await createOrmConnection();

  const dayController = new DayController();
  const helpController = new HelpController();

  bot.hears('/start', (ctx) => helpController.start(ctx));
  bot.hears(/get\s(\d{2})\/((\d{2})|(\d{1}))/, (ctx) =>
    dayController.getDay(ctx),
  );
  // bot.command('show_all_info'
  //   bot.hears(/set\s(\d{2})\/((\d{2})|(\d{1}))\s(10|11|12|[1-9]):([0-5][0-9])$/, (ctx)=> {ctx.match[0]})
  // bot.hears(/get\s(\d{2})\/((\d{2})|(\d{1}))/,day)
  bot.launch();
})();
