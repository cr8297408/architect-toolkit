export class CassandraCondition {
  constructor(
    public field: string,
    public operator: CassandraOperator,
    public value: CassandraValue
  ) {}

  toString(): string {
    return `${this.field} ${this.operator} ?`;
  }
}
export enum CassandraOperator {
  'EQUALS' = '=',
  'NOT_EQUALS' = '!=',
  'GREATER_THAN' = '>',
  'GREATER_THAN_OR_EQUAL' = '>=',
  'LESS_THAN' = '<',
  'LESS_THAN_OR_EQUAL' = '<=',
  'IN' = 'IN',
  'NOT_IN' = 'NOT IN',
  'CONTAINS' = '~',
  'DOES_NOT_CONTAIN' = '!~',
}

export type CassandraValue = string | number | boolean | Date | Array<string | number>;

/**
 * @Generic T - Type of the entity to query
 */
export class GeneralCassandraQueryBuilder<T> {
  private readonly tableName: string;
  private selectedColumns: string[] = ['*'];
  private readonly conditions: CassandraCondition[] = [];
  private orderByClause: string = '';
  private readonly keyspace: string;
  private readonly limit?: number;

  constructor({ tableName, keyspace, limit }: IGeneralCassandraQueryBuilderOptions) {
    this.tableName = tableName;
    this.keyspace = keyspace;
    this.limit = limit;
  }

  select(columns: string[] = ['*']): this {
    this.selectedColumns = columns;
    return this;
  }

  where(field: keyof T, operator: CassandraOperator, value: CassandraValue): this {
    this.conditions.push(new CassandraCondition(field as string, operator, value));
    return this;
  }

  orderBy(field: keyof T, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `ORDER BY ${field as string} ${direction}`;
    return this;
  }

  build(): { query: string; parameters: CassandraValue[]; limit: number | undefined } {
    let query = `SELECT ${this.selectedColumns.join(', ')} FROM ${this.keyspace}.${this.tableName}`;
    const parameters: CassandraValue[] = [];

    if (this.conditions.length > 0) {
      query += ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(...this.conditions.map((c) => c.value));
    }

    if (this.orderByClause !== undefined) {
      query += ' ' + this.orderByClause;
    }

    return { query, parameters, limit: this.limit };
  }
}

export interface IGeneralCassandraQueryBuilderOptions {
  tableName: string;
  keyspace: string;
  limit?: number;
}
