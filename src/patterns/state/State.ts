import { Domain, Response } from '../../domain';
import { IStep } from '../step';

export interface IState {
  accept: (step: IStep) => Promise<void>;
}

export abstract class State implements IState {
  #action: string;
  #payload: Domain;
  #response?: Response;

  async accept(step: IStep): Promise<void> {
    await step.next(this);
  }

  set response(response: Response | undefined) {
    this.#response = response;
  }

  get response(): Response | undefined {
    return this.#response;
  }

  set action(action: string) {
    this.#action = action;
  }

  get action(): string {
    return this.#action;
  }

  set payload(payload: Domain) {
    this.#payload = payload;
  }

  get payload(): Domain {
    return this.#payload;
  }
}
