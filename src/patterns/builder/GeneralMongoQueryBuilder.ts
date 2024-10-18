export type MongoValue =
  | string
  | number
  | boolean
  | Date
  | unknown
  | Array<any>
  | object
  | null;

export enum MongoOperator {
  EQUALS = '$eq',
  NOT_EQUALS = '$ne',
  GREATER_THAN = '$gt',
  GREATER_THAN_OR_EQUAL = '$gte',
  LESS_THAN = '$lt',
  LESS_THAN_OR_EQUAL = '$lte',
  IN = '$in',
  NOT_IN = '$nin',
  EXISTS = '$exists',
  TYPE = '$type',
  REGEX = '$regex',
  TEXT = '$text',
}

export class MongoCondition {
  constructor(
    public field: string,
    public operator: MongoOperator | string,
    public value: MongoValue
  ) {}

  toObject(): object {
    if (this.operator === MongoOperator.EXISTS) {
      return { [this.field]: { [this.operator]: this.value } };
    }
    if (this.operator === MongoOperator.TYPE) {
      return { [this.field]: { [this.operator]: this.value } };
    }
    if (this.operator === MongoOperator.TEXT) {
      return { $text: { $search: this.value } };
    }
    return { [this.field]: { [this.operator]: this.value } };
  }
}

export class MongoQueryBuilder<T> {
  private conditions: MongoCondition[] = [];
  private projectionFields: string[] = [];
  private sortOptions: Record<string, 1 | -1> = {};
  private skipValue: number | null = null;
  private limitValue: number | null = null;
  private updateOperations: object | null = null;

  constructor(private readonly collectionName: string) {}

  where(
    field: keyof T,
    operator: MongoOperator | string,
    value: MongoValue
  ): this {
    this.conditions.push(new MongoCondition(field as string, operator, value));
    return this;
  }

  select(fields: (keyof T)[]): this {
    this.projectionFields = fields as string[];
    return this;
  }

  sort(field: keyof T, direction: 1 | -1): this {
    this.sortOptions[field as string] = direction;
    return this;
  }

  skip(value: number): this {
    this.skipValue = value;
    return this;
  }

  limit(value: number): this {
    this.limitValue = value;
    return this;
  }

  update(operations: object): this {
    this.updateOperations = operations;
    return this;
  }

  buildFind(): {
    collection: string;
    filter: object;
    options: {
      projection?: object;
      sort?: object;
      skip?: number;
      limit?: number;
    };
  } {
    const filter = this.buildFilter();
    const options: any = {};

    if (this.projectionFields.length > 0) {
      options.projection = this.projectionFields.reduce(
        (acc, field) => ({ ...acc, [field]: 1 }),
        {}
      );
    }

    if (Object.keys(this.sortOptions).length > 0) {
      options.sort = this.sortOptions;
    }

    if (this.skipValue !== null) {
      options.skip = this.skipValue;
    }

    if (this.limitValue !== null) {
      options.limit = this.limitValue;
    }

    return {
      collection: this.collectionName,
      filter,
      options,
    };
  }

  buildInsertOne(document: Partial<T>): {
    collection: string;
    document: Partial<T>;
  } {
    return {
      collection: this.collectionName,
      document,
    };
  }

  buildInsertMany(documents: Partial<T>[]): {
    collection: string;
    documents: Partial<T>[];
  } {
    return {
      collection: this.collectionName,
      documents,
    };
  }

  buildUpdateOne(): {
    collection: string;
    filter: object;
    update: object;
    options: { upsert?: boolean };
  } {
    if (!this.updateOperations) {
      throw new Error(
        'Update operations not specified. Use the update() method to set update operations.'
      );
    }

    return {
      collection: this.collectionName,
      filter: this.buildFilter(),
      update: this.updateOperations,
      options: { upsert: false },
    };
  }

  buildUpdateMany(): {
    collection: string;
    filter: object;
    update: object;
    options: { upsert?: boolean };
  } {
    if (!this.updateOperations) {
      throw new Error(
        'Update operations not specified. Use the update() method to set update operations.'
      );
    }

    return {
      collection: this.collectionName,
      filter: this.buildFilter(),
      update: this.updateOperations,
      options: { upsert: false },
    };
  }

  buildDeleteOne(): {
    collection: string;
    filter: object;
  } {
    return {
      collection: this.collectionName,
      filter: this.buildFilter(),
    };
  }

  buildDeleteMany(): {
    collection: string;
    filter: object;
  } {
    return {
      collection: this.collectionName,
      filter: this.buildFilter(),
    };
  }

  buildAggregate(pipeline: object[]): {
    collection: string;
    pipeline: object[];
  } {
    return {
      collection: this.collectionName,
      pipeline,
    };
  }

  private buildFilter(): object {
    return this.conditions.reduce((acc, condition) => {
      const conditionObj = condition.toObject();
      return { ...acc, ...conditionObj };
    }, {});
  }
}
