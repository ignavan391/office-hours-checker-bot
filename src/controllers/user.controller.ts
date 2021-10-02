import { getConnection } from 'typeorm';
import { BotException } from '../common/errors';
import { User, UserDto } from '../types/user.type';

export class UserController {
  async findOrSaveUser(dto: UserDto): Promise<User> {
    try {
      let user = (
        await getConnection().query(
          'SELECT * FROM "users" WHERE telegramid = $1',
          [dto.telegramId],
        )
      )[0];

      const args = [dto.telegramId?.toString()];

      if (dto.name) {
        args.push(dto.name);
      }

      if (!user) {
        user = (
          await getConnection().query(
            `INSERT INTO users("telegramid" ${
              dto.name ? ',"name"' : ''
            }) VALUES ($1 ${dto.name ? ',$2' : ''}) RETURNING *`,
            args,
          )
        )[0];
      }
      return user;
    } catch {
      throw new BotException('База данных поломалась');
    }
  }
}
