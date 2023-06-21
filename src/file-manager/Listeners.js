import { EOL, homedir } from 'node:os';
import readline from 'node:readline';

export class Listeners {
  constructor(userName) {
    this.userName = userName;
    this.byeMessage = `Thank you for using File Manager, ${this.userName}, goodbye!` + EOL;
    this.rl = null;
    this.initialize();
  }

  initialize() {
    readline.emitKeypressEvents(process.stdin);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    this.rl.on('line', (data) => {
      this.handleCommand(data.trim());
    });
    process.on('exit', () => {
      process.stdout.write(this.byeMessage);
      this.rl?.close();
    });
    process.stdin.on('keypress', (str, key) => {
      if (key && key.name === 'return') {
        this.showCurrentWorkDir();
      }
      if (key && key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
  };

  showCurrentWorkDir() {
    process.stdout.write(`You are currently in ${homedir()}` + EOL);
  }

  handleCommand(command) {
    switch (command) {
      case 'cd': {
        this.showCurrentWorkDir();
      }
      case '.exit': {
        process.exit();
      }
      default:
        process.stdout.write(`Unknown operation, please enter another command` + EOL);
        break;
    }
  }
}
