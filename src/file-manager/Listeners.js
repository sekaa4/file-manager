import { EOL } from 'node:os';

export class Listeners {
  constructor(userName) {
    this.userName = userName;
    this.byeMessage = `Thank you for using File Manager, ${this.userName}, goodbye!` + EOL;
    this.handleSignal = this.handleSignal.bind(this);
    this.initialize();
  }

  initialize() {
    process.stdin.on('data', (data) => {
      if (data.toString().trim() === '.exit') {
        process.exit();
      }
    });
    process.on('SIGINT', this.handleSignal);
    process.on('exit', () => {
      process.stdout.write(this.byeMessage);
    });
  };

  handleSignal(signal) {
    switch (signal) {
      case 'SIGINT': {
        process.exit();
      }
      default: break;
    }
  };
}
