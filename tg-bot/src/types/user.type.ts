export type User = {
  id: string;
  name?: string | null;
  telegram_id: number;
  created_at: Date;
  updated_at: Date;
};

export type UserDto = Pick<User, 'telegram_id' | 'name'>;
