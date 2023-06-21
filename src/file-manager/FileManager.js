import { EOL, homedir } from 'node:os';
import { Listeners } from './Listeners.js';

export class FileManager {
  constructor() {
    this.username = null;
    this._prefix = '--username=';
    this._errorMessage = `Entry correct argument, according to template with npm command: <<-- --username=your_username>>`;
    this._welcomeMessage = `Welcome to the File Manager, ${this.username}!` + EOL;
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
      this.listeners = new Listeners(this.username);
      process.stdout.write(`You are currently in ${homedir()}` + EOL);
      process.chdir(homedir());
    } catch (error) {
      if (error.message === this._errorMessage) {
        console.log(error.message);
        process.exit(1);
      }
      throw error;
    }
  }

  checkUserName() {
    const userNameArg = process.argv.slice(2).find((arg) => arg.startsWith(this._prefix));
    const userName = userNameArg?.slice(this._prefix.length);
    if (userNameArg && userName) {
      this.username = userName;
      this.welcomeMessage = userName;
    } else throw new Error(this._errorMessage);
  }

  welcome() {
    process.stdout.write(this.welcomeMessage);
  }
}
