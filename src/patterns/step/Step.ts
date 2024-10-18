import { State } from '..';

export interface IStep {
  name: string;
  next: (state: State) => Promise<void>;
}

export abstract class Step implements IStep {
  abstract name: string;
  abstract exec(state: State): Promise<void>;

  async next(state: State): Promise<void> {
    await this.exec(state);
  }
}
