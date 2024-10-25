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

export class CassandraSetColumns {
  constructor(
    public field: string,
    public value: CassandraValue
  ) {}

  /**
   *
   * @description Builds the string to be used in the query, don´t remove spaces
   */
  toString(): string {
    return ` "${this.field}" = ? `;
  }
}

export type CassandraValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number>;

/**
 * @Generic T - Type of the entity to query
 */
export class GeneralCassandraQueryBuilder<T> {
  private readonly tableName: string;
  private selectedColumns: string[] = ['*'];
  private readonly conditions: CassandraCondition[] = [];
  private readonly setColumns: CassandraSetColumns[] = [];
  private orderByClause: string = '';
  private readonly keyspace: string;
  private readonly limit?: number;
  private useAllowFiltering: boolean = false;

  constructor({
    tableName,
    keyspace,
    limit,
  }: IGeneralCassandraQueryBuilderOptions) {
    this.tableName = tableName;
    this.keyspace = keyspace;
    this.limit = limit;
  }

  allowFiltering(useAllowFiltering: boolean): this {
    this.useAllowFiltering = useAllowFiltering;
    return this;
  }

  select(columns: string[] = ['*']): this {
    this.selectedColumns = columns;
    return this;
  }

  where(
    field: keyof T,
    operator: CassandraOperator,
    value: CassandraValue
  ): this {
    this.conditions.push(
      new CassandraCondition(field as string, operator, value)
    );
    return this;
  }

  set(field: keyof T, value: CassandraValue): this {
    this.setColumns.push(new CassandraSetColumns(field as string, value));
    return this;
  }

  orderBy(field: keyof T, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `ORDER BY ${field as string} ${direction}`;
    return this;
  }

  build(): IBuildQueryResponse {
    let query = `SELECT ${this.selectedColumns.join(', ')} FROM ${this.keyspace}.${this.tableName}`;
    const parameters: CassandraValue[] = [];

    if (this.conditions.length > 0) {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(...this.conditions.map((c) => c.value));
    }

    if (this.orderByClause !== undefined) {
      query += ' ' + this.orderByClause;
    }

    if (this.useAllowFiltering) {
      query += ' ALLOW FILTERING';
    }

    return { query, parameters, limit: this.limit };
  }

  buildUpdateQuery(): IBuildQueryResponse {
    let query = `UPDATE ${this.keyspace}.${this.tableName} SET`;
    const parameters: CassandraValue[] = [];

    query += this.setColumns.map((c) => c.toString()).join(', ');
    parameters.push(...this.setColumns.map((c) => c.value));

    this.conditions.forEach((c) => {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(c.value);
    });

    return { query, parameters, limit: this.limit };
  }

  buildCountQuery(): IBuildQueryResponse {
    let query = `SELECT COUNT(*) FROM ${this.keyspace}.${this.tableName}`;
    const parameters: CassandraValue[] = [];

    if (this.conditions.length > 0) {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(...this.conditions.map((c) => c.value));
    }

    if (this.useAllowFiltering) {
      query += ' ALLOW FILTERING';
    }

    return { query, parameters, limit: this.limit };
  }
}

export interface IBuildQueryResponse {
  query: string;
  parameters: CassandraValue[];
  limit: number | undefined;
}

export interface IGeneralCassandraQueryBuilderOptions {
  tableName: string;
  keyspace: string;
  limit?: number;
}
