import { SqlSpecification } from '../specification';

export class BaseRepository {
  /**
   * Combines an array of SqlSpecifications into a single specification, this facilitates filter scaling
   *
   * @param specifications - The array of SqlSpecifications to be combined
   * @returns An object containing the combined SQL string and parameters.
   */
  combineFilterSpecifications(specifications: SqlSpecification[]): {
    sql: string;
    params: any[];
  } {
    const sqlParts: string[] = [];
    /**
     * Each specifications must be contain the operator to be used in the SQL query, the sql query for the filter and the parameters to pass to the query
     */
    specifications.forEach((spec, index) => {
      const { sql } = spec.toSql();
      // Ignore the last operator as it does not need
      const validateOperator =
        index < specifications.length - 1 ? spec.operator : '';
      sqlParts.push(sql + ' ' + validateOperator);
    });
    return { sql: sqlParts.join(' '), params: [] };
  }
}
