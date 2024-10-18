import { type ICommand } from './ICommand';

export class CommandSqlOrCassandraManager {
  private commands: ICommand[] = [];
  private command: ICommand;
  private readonly executor: IExecutorSql;

  constructor(executor: IExecutorSql) {
    this.executor = executor;
  }

  addCommand(command: ICommand): void {
    this.command = command;
    this.commands.push(command);
  }

  async executeCommands(): Promise<void> {
    const executedCommands: ICommand[] = [];
    const batchQueries: Array<{
      query: string;
      params: Array<string | number | undefined | boolean | Date>;
    }> = [];

    try {
      for (const command of this.commands) {
        const { query, params } = await command.execute(); // Cambiamos aquí para obtener la consulta y parámetros
        batchQueries.push({ query, params });
        executedCommands.push(command);
      }

      // Ejecutar el batch utilizando la interfaz
      await this.executor.executeBatch(batchQueries);
    } catch (error) {
      console.error('Error during update, rolling back...', error);
      // Revertir los cambios en paralelo de los comandos que se ejecutaron
      for (const command of this.commands) {
        const { query, params } = await command.undo(); // Cambiamos aquí para obtener la consulta y parámetros
        batchQueries.push({ query, params });
        executedCommands.push(command);
      }

      // Ejecutar el batch utilizando la interfaz
      await this.executor.executeBatch(batchQueries);
      throw error;
    } finally {
      // Reinicia el arreglo de comandos
      this.commands = [];
    }
  }

  async executeSingleCommand(): Promise<void> {
    try {
      const { query, params } = await this.command.execute();
      await this.executor.executeQuery(query, params);
    } catch (error) {
      console.error('Error during update, rolling back...', error);
      await this.command.undo();
      throw error;
    }
  }
}

export interface IExecutorSql {
  executeQuery: (
    query: string,
    params: Array<string | number | undefined | boolean | Date>
  ) => Promise<void>;
  executeBatch: (
    queries: Array<{
      query: string;
      params: Array<string | number | undefined | boolean | Date>;
    }>
  ) => Promise<void>;
}
