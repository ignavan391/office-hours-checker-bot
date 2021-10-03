import moment from 'moment';
import { getConnection } from 'typeorm';
import { Ctx } from '../types/ctx.type';
import { WorkDate } from '../types/date.type';

export class DayController {

  async getDay(ctx: Ctx) {
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();

    const date = moment(dayDto)
    const day:WorkDate = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date =$1 AND "dates"."user_id" = $2',
        [date.toISOString(),ctx.user.id],
      )
    )[0];

    if (day) {
      ctx.reply(`[Year]: ${date.year()}\n[Date]: ${date.format('MM/DD')} \n[Time 🕔]: ${day.work_hours}`);
    } else {
      ctx.reply('[Info] Нет информации');
    }
  }

  async setDay(ctx: Ctx) {
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();
    const workHours = ctx.match[5];

    const user = ctx.user

    const date = moment(dayDto).toISOString();
    let day: WorkDate = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date = $1 AND "dates"."user_id" = $2',
        [date,ctx.user.id],
      )
    )[0];

    if (day) {
      day = (
        await getConnection().query(`
          UPDATE dates SET work_hours = CASE 
            WHEN work_hours + $1 > 24 THEN 24
            ELSE work_hours + $1 
          END
          WHERE dates."came"::date = $2 AND "user_id" = $3 RETURNING *`,
          [workHours, date,user.id],
        )
      )[0][0];
    } else {
      const args = [user.id, workHours, date];

      day = (
        await getConnection().query(
          `INSERT INTO dates(user_id,work_hours,came) VALUES ($1,$2,$3) RETURNING *`,
          args,
        )
      )[0];
    }
    ctx.reply(`[Time 🕔]: ${day.work_hours}`);
  }
}
