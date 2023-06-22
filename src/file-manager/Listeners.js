import { EOL } from 'node:os';
import readline from 'node:readline';
import { CommandHandlerController } from '../command-handler/CommandHandlerController.js';

export class Listeners {
  constructor(userName) {
    this.userName = userName;
    this.byeMessage = `Thank you for using File Manager, ${this.userName}, goodbye!` + EOL;
    this.failMessage = 'Operation failed: ';
    this.rl = null;
    this.commandsHandler = new CommandHandlerController();
    this.initialize();
  }

  initialize() {
    readline.emitKeypressEvents(process.stdin);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    this.rl.on('line', async (data) => {
      try {
        await this.commandsHandler.start(data);
      } catch (error) {
        process.stdout.write(this.failMessage + error.message + EOL);
      }
    });
    process.on('exit', () => {
      process.stdout.write(this.byeMessage);
      this.rl?.close();
    });
    process.stdin.on('keypress', (str, key) => {
      if (key && key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
  };
}
