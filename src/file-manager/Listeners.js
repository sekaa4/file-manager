import { EOL } from 'node:os';
import readline from 'node:readline';
import { NavigationWorkDir } from '../navigation/NavigationWorkDir.js';

export class Listeners {
  constructor(userName) {
    this.userName = userName;
    this.byeMessage = `Thank you for using File Manager, ${this.userName}, goodbye!` + EOL;
    this.rl = null;
    this.navigationCLI = new NavigationWorkDir();
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
      await this.navigationCLI.handleCommand(data.trim());
      this.navigationCLI.showCurrentWorkDir();
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
