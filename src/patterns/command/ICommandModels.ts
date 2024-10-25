export interface ICommand {
  execute: () => Promise<{
    query: string;
    params: Array<string | number | undefined | boolean>;
  }>;
  undo: () => Promise<{
    query: string;
    params: Array<string | number | undefined | boolean>;
  }>;
}

export interface ICommandManager {
  addCommand: (command: ICommand) => void;
  executeCommands: () => Promise<void>;
  executeSingleCommand: () => Promise<void>;
}
