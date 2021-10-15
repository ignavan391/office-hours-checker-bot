import moment from 'moment';
import { getConnection } from 'typeorm';
import { DatesApiQueueName } from '../common/amqp/constants';
import ampqConnection from '../common/amqp/transport';
import logger from '../common/logger';
import { Ctx, UserContext } from '../types/ctx.type';
import { WorkDate } from '../types/date.type';

export class DayController {
  async getDay(ctx: Ctx) {
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();

    const date = moment(dayDto);
    const day: WorkDate = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date =$1 AND "dates"."user_id" = $2',
        [date.toISOString(), ctx.user.id],
      )
    )[0];

    if (day) {
      ctx.reply(
        `[Year]: ${date.year()}\n[Date]: ${date.format(
          'MM/DD',
        )} \n[Time 🕔]: ${day.work_hours.toFixed(2)}`,
      );
    } else {
      ctx.reply('[Info] Нет информации');
    }
  }

  async setDay(ctx: Ctx) {
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();
    let workHours: string;
    const workTimeDto = ctx.match[5];

    if (!workTimeDto) {
      logger.error({
        level: 'error',
        message: 'incorrect time',
      });
      ctx.reply('[Info] Некорректные данные');
      return;
    }
    if (workTimeDto?.includes('m')) {
      workHours = (Number.parseInt(workTimeDto.split('m')[0]) / 60).toString();
    } else if (workTimeDto?.includes('h')) {
      workHours = workTimeDto.split('h')[0];
    } else {
      workHours = workTimeDto;
    }

    const user = ctx.user;

    const date = moment(dayDto).toISOString();
    let day: WorkDate = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date = $1 AND "dates"."user_id" = $2',
        [date, ctx.user.id],
      )
    )[0];

    if (day) {
      day = (
        await getConnection().query(
          `
          UPDATE dates SET work_hours = CASE 
            WHEN work_hours + $1 > 24 THEN 24
            ELSE work_hours + $1 
          END
          WHERE dates."came"::date = $2 AND "user_id" = $3 RETURNING *`,
          [workHours, date, user.id],
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
    ampqConnection.getChannel().sendToQueue(DatesApiQueueName, Buffer.from(JSON.stringify(day)));
    ctx.reply(`[Time 🕔]: ${day.work_hours.toFixed(2)}`);
  }

  async getLastDates(ctx: UserContext) {
    const dates: WorkDate[] = await getConnection().query(
      'SELECT * FROM "dates" WHERE "dates"."user_id" = $1 ORDER BY "dates"."came" LIMIT 30',
      [ctx.user.id],
    );

    const result = dates
      .map(
        (item) => `${moment(item.came).format('MM/DD')} | ${item.work_hours}\n`,
      )
      .join('');
    if (result.length < 1) {
      ctx.reply(`ooops информация не найдена :(`);
      return;
    }
    ctx.reply(result);
  }
}
