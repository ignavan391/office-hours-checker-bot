export class BotException<T extends string | { code: String; payload?: any }> {
  public constructor(public readonly errors: T | ReadonlyArray<T>) {}
}
