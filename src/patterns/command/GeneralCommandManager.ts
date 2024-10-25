import { type ICommandManager, type ICommand } from './ICommandModels';

export class GeneralCommandManager implements ICommandManager {
  private commands: ICommand[] = [];
  private command: ICommand;

  addCommand(command: ICommand): void {
    this.command = command;
    this.commands.push(command);
  }

  async executeCommands(): Promise<void> {
    const executedCommands: ICommand[] = [];
    try {
      for (const command of this.commands) {
        await command.execute();
        executedCommands.push(command);
      }
    } catch (error) {
      console.error('Error during update, rolling back...', error);
      for (let i = executedCommands.length - 1; i >= 0; i--) {
        await executedCommands[i].undo();
      }
      throw error;
    } finally {
      this.commands = [];
    }
  }

  async executeSingleCommand(): Promise<void> {
    try {
      await this.command.execute();
    } catch (error) {
      console.error('Error during update, rolling back...', error);
      await this.commands[0].undo();
      throw error;
    }
  }
}
