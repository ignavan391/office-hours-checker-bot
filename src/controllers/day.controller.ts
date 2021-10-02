import moment from 'moment';
import { getConnection } from 'typeorm';
import { Ctx } from '../types/ctx.type';
import { WorkDate } from '../types/date.type';

export class DayController {
  async getDay(ctx: Ctx) {
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();

    const date = moment(dayDto).toISOString();
    const day: WorkDate = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date = $1',
        [date],
      )
    )[0];

    if (day) {
      ctx.reply(`date: ${date} \n time: ${day.workHours}`);
    } else {
      ctx.reply('Нет информации');
    }
  }
}
