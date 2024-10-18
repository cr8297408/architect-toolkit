export class SQLCondition {
  constructor(
    public field: string,
    public operator: SQLOperator,
    public value: SQLValue
  ) {}

  toString(): string {
    if (
      this.operator === SQLOperator.IS_NULL ||
      this.operator === SQLOperator.IS_NOT_NULL
    ) {
      return `${this.field} ${this.operator}`;
    }
    return `${this.field} ${this.operator} ?`;
  }
}

export enum SQLOperator {
  'EQUALS' = '=',
  'NOT_EQUALS' = '!=',
  'GREATER_THAN' = '>',
  'GREATER_THAN_OR_EQUAL' = '>=',
  'LESS_THAN' = '<',
  'LESS_THAN_OR_EQUAL' = '<=',
  'IN' = 'IN',
  'NOT_IN' = 'NOT IN',
  'LIKE' = 'LIKE',
  'NOT_LIKE' = 'NOT LIKE',
  'IS_NULL' = 'IS NULL',
  'IS_NOT_NULL' = 'IS NOT NULL',
}

export type SQLValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number>
  | null;

export enum JoinType {
  'INNER' = 'INNER JOIN',
  'LEFT' = 'LEFT JOIN',
  'RIGHT' = 'RIGHT JOIN',
  'FULL' = 'FULL JOIN',
}

export class Join {
  constructor(
    public table: string,
    public type: JoinType,
    public on: SQLCondition
  ) {}

  toString(): string {
    return `${this.type} ${this.table} ON ${this.on.toString()}`;
  }
}

/**
 * @Generic T - Type of the entity to query
 */
export class GeneralSQLQueryBuilder<T> {
  private readonly tableName: string;
  private selectedColumns: string[] = ['*'];
  private readonly conditions: SQLCondition[] = [];
  private readonly joins: Join[] = [];
  private orderByClause: string = '';
  private limitClause: string = '';
  private offsetClause: string = '';
  private groupByClause: string = '';
  private havingClause: SQLCondition | null = null;
  private operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' = 'SELECT';
  private insertValues: Record<string, SQLValue> | null = null;
  private updateValues: Record<string, SQLValue> | null = null;

  constructor({ tableName }: IGeneralSQLQueryBuilderOptions) {
    this.tableName = tableName;
  }

  select(columns: string[] = ['*']): this {
    this.operation = 'SELECT';
    this.selectedColumns = columns;
    return this;
  }

  insert(values: Record<string, SQLValue>): this {
    this.operation = 'INSERT';
    this.insertValues = values;
    return this;
  }

  update(values: Record<string, SQLValue>): this {
    this.operation = 'UPDATE';
    this.updateValues = values;
    return this;
  }

  delete(): this {
    this.operation = 'DELETE';
    return this;
  }

  where(field: keyof T, operator: SQLOperator, value: SQLValue): this {
    this.conditions.push(new SQLCondition(field as string, operator, value));
    return this;
  }

  join(
    table: string,
    type: JoinType,
    onField: keyof T,
    operator: SQLOperator,
    value: SQLValue
  ): this {
    this.joins.push(
      new Join(
        table,
        type,
        new SQLCondition(onField as string, operator, value)
      )
    );
    return this;
  }

  orderBy(field: keyof T, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `ORDER BY ${field as string} ${direction}`;
    return this;
  }

  limit(limit: number): this {
    this.limitClause = `LIMIT ${limit}`;
    return this;
  }

  offset(offset: number): this {
    this.offsetClause = `OFFSET ${offset}`;
    return this;
  }

  groupBy(columns: Array<keyof T>): this {
    this.groupByClause = `GROUP BY ${columns.join(', ')}`;
    return this;
  }

  having(field: keyof T, operator: SQLOperator, value: SQLValue): this {
    this.havingClause = new SQLCondition(field as string, operator, value);
    return this;
  }

  build(): { query: string; parameters: SQLValue[] } {
    let query = '';
    const parameters: SQLValue[] = [];

    switch (this.operation) {
      case 'SELECT':
        query = this.buildSelectQuery(parameters);
        break;
      case 'INSERT':
        query = this.buildInsertQuery(parameters);
        break;
      case 'UPDATE':
        query = this.buildUpdateQuery(parameters);
        break;
      case 'DELETE':
        query = this.buildDeleteQuery(parameters);
        break;
    }

    return { query, parameters };
  }

  private buildSelectQuery(parameters: SQLValue[]): string {
    let query = `SELECT ${this.selectedColumns.join(', ')} FROM ${
      this.tableName
    }`;

    if (this.joins.length > 0) {
      query += ' ' + this.joins.map((j) => j.toString()).join(' ');
      parameters.push(...this.joins.map((j) => j.on.value));
    }

    if (this.conditions.length > 0) {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(
        ...this.conditions.map((c) => c.value).filter((v) => v !== null)
      );
    }

    if (this.groupByClause) {
      query += ' ' + this.groupByClause;
    }

    if (this.havingClause) {
      query += ' HAVING ' + this.havingClause.toString();
      parameters.push(this.havingClause.value);
    }

    if (this.orderByClause) {
      query += ' ' + this.orderByClause;
    }

    if (this.limitClause) {
      query += ' ' + this.limitClause;
    }

    if (this.offsetClause) {
      query += ' ' + this.offsetClause;
    }

    return query;
  }

  private buildInsertQuery(parameters: SQLValue[]): string {
    if (!this.insertValues) throw new Error('No insert values provided');
    const columns = Object.keys(this.insertValues);
    const values = Object.values(this.insertValues);
    parameters.push(...values);
    return `INSERT INTO ${this.tableName} (${columns.join(
      ', '
    )}) VALUES (${values.map(() => '?').join(', ')})`;
  }

  private buildUpdateQuery(parameters: SQLValue[]): string {
    if (!this.updateValues) throw new Error('No update values provided');
    const setClause = Object.entries(this.updateValues)
      .map(([key, value]) => {
        parameters.push(value);
        return `${key} = ?`;
      })
      .join(', ');

    let query = `UPDATE ${this.tableName} SET ${setClause}`;

    if (this.conditions.length > 0) {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(
        ...this.conditions.map((c) => c.value).filter((v) => v !== null)
      );
    }

    return query;
  }

  private buildDeleteQuery(parameters: SQLValue[]): string {
    let query = `DELETE FROM ${this.tableName}`;

    if (this.conditions.length > 0) {
      query +=
        ' WHERE ' + this.conditions.map((c) => c.toString()).join(' AND ');
      parameters.push(
        ...this.conditions.map((c) => c.value).filter((v) => v !== null)
      );
    }

    return query;
  }
}

export interface IGeneralSQLQueryBuilderOptions {
  tableName: string;
}
