export type User = {
  id: string;
  name?: string | null;
  telegramId: number;
};

export type UserDto = Pick<User, 'telegramId' | 'name'>;
