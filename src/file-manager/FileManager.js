import { EOL, homedir } from 'node:os';
import { Listeners } from './Listeners.js';

export class FileManager {
  constructor() {
    this.userName = 'Anonymous';
    this._prefix = '--username=';
    this._errorMessage = `Entry correct argument, according to template with npm command: <-- --username=your_username>`;
    this._errorOperationMessage = `Operation failed: `;
    this._welcomeMessage = `Welcome to the File Manager, ${this.userName}!` + EOL;
    this.start();
  }

  set welcomeMessage(user) {
    this._welcomeMessage = `Welcome to the File Manager, ${user}!` + EOL;
  }

  get welcomeMessage() {
    return this._welcomeMessage;
  }

  start() {
    try {
      this.checkUserName();
      this.welcome();
      this.listeners = new Listeners(this.userName);
      process.stdout.write(`You are currently in ${homedir()}` + EOL);
      process.chdir(homedir());
    } catch (error) {
      if (error.message === this._errorMessage) {
        console.log(error.message);
        process.exit(1);
      } else {
        console.log(this._errorOperationMessage + error.message + EOL);
      }
    }
  }

  checkUserName() {
    const userNameArg = process.argv.slice(2).find((arg) => arg.startsWith(this._prefix));
    const userName = userNameArg?.slice(this._prefix.length);

    if (userNameArg && userName) {
      this.userName = userName;
      this.welcomeMessage = userName;
      return;
    }

    if (userNameArg && !userName || process.argv.length === 2) {
      this.welcomeMessage = this.userName;
    } else throw new Error(this._errorMessage);
  }

  welcome() {
    process.stdout.write(this.welcomeMessage);
  }
}
