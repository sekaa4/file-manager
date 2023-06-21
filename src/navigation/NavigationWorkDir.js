import { resolve } from 'node:path';
import { EOL } from 'node:os';
import { readdir } from 'node:fs/promises';

export class NavigationWorkDir {
  constructor() {
    this.rootDir = process.cwd().slice(0, 3);
    this.failMessage = 'Operation failed: ';
  }

  showCurrentWorkDir() {
    process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
  }

  async handleCommand(command) {
    const splitArgs = command.split(' ');
    const curCommand = splitArgs.shift();
    // console.log(curCommand);
    switch (curCommand) {
      case 'cd': {
        const str = splitArgs.join(' ').replaceAll('\'\"', '');
        // if (curCommand.length !== 1) {
        //   process.stdout.write(`Incorrect arguments, please enter correct path` + EOL);
        //   break;
        // }
        // console.log('str', str);
        const path = resolve(process.cwd(), str);
        // console.log('path', path);
        try {
          process.chdir(path);
        } catch (error) {
          error.message = 'no directory for this path';
          process.stdout.write(this.failMessage + error.message + EOL);
        } finally {
          break;
        }
      }
      case 'up': {
        if (splitArgs.length) {
          process.stdout.write(`Incorrect arguments, please enter only <up> command` + EOL);
          break;
        }
        if (process.cwd() !== this.rootDir) {
          process.chdir('../');
          break;
        }
        break;
      }
      case 'ls': {
        if (splitArgs.length) {
          process.stdout.write(`Incorrect arguments, please enter only <ls> command` + EOL);
          break;
        }
        await this.showDirContent();
        break;
      }
      case '.exit': {
        process.exit();
      }

      default:
        process.stdout.write(`Unknown operation, please enter another command` + EOL);
        break;
    }
  }

  async showDirContent() {
    try {
      const path = resolve(process.cwd());
      const array = await readdir(path, { withFileTypes: true });
      const result = array.reduce((acc, cur) => {
        const curObjWithType = { name: cur.name, type: cur.isFile() ? 'file' : 'directory' };
        return [...acc, curObjWithType];
      }, [])
        .sort((a, b) => a.type.localeCompare(b.type));

      console.table(result);
    } catch (error) {
      error.message = 'error reading directory';
      process.stdout.write(this.failMessage + error.message + EOL);
    }
  };
}
