import { Domain, type Transaction } from '../../domain';
import { State } from './State';

export class TransactionState extends State {
  readonly name = 'TransactionState';
  #mainTransactionUUID: string;
  #mainTransaction: Transaction;
  #childTransaction: Transaction;
  #payloadRequest: Domain;

  get mainTransactionUUID(): string {
    return this.#mainTransactionUUID;
  }

  set mainTransactionUUID(data: string) {
    this.#mainTransactionUUID = data;
  }

  get mainTransaction(): Transaction {
    return this.#mainTransaction;
  }

  set mainTransaction(data: Transaction) {
    this.#mainTransaction = data;
  }

  get childTransaction(): Transaction {
    return this.#childTransaction;
  }

  set childTransaction(data: Transaction) {
    this.#childTransaction = data;
  }

  get payloadRequest(): Domain {
    return this.#payloadRequest;
  }

  set payloadRequest(data: Domain) {
    this.#payloadRequest = data;
  }
}
