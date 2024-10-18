export interface SqlSpecification {
  toSql: () => {
    sql: string;
    operator: string;
  };
  operator: string;
}
