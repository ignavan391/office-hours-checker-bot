import moment from 'moment';
import { getConnection } from 'typeorm';
import { Ctx } from '../types/ctx.type';
import { WorkDate } from '../types/date.type';
import { UserDto } from '../types/user.type';
import { UserController } from './user.controller';

export class DayController {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
  }
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

  async setDay(ctx: Ctx) {
    if (!ctx.from) {
      ctx.reply('Информация о получателе не найдена');
      return;
    }
    const userDto: UserDto = {
      name: ctx.from.username,
      telegramId: ctx.from.id,
    };
    const dayDto =
      ctx.match[1] + '/' + ctx.match[2] + '/' + moment().year().toString();
    const workHours = ctx.match[5];

    const date = moment(dayDto).toISOString();
    let day = (
      await getConnection().query(
        'SELECT dates.* FROM "dates" WHERE "dates"."came"::date = $1',
        [date],
      )
    )[0];

    if (day) {
      day = (
        await getConnection().query(
          `UPDATE dates SET work_hours = work_hours + $1 WHERE dates."came"::date = $2 RETURNING *`,
          [workHours, date],
        )
      )[0][0];
    } else {
      const user = await this.userController.findOrSaveUser(userDto);
      const args = [user.id, workHours, date];

      day = (
        await getConnection().query(
          `INSERT INTO dates(user_id,work_hours,came) VALUES ($1,$2,$3) RETURNING *`,
          args,
        )
      )[0];
    }
    ctx.reply(day.work_hours.toString());
  }
}
