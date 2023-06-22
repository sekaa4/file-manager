import { resolve } from 'node:path';
import { EOL } from 'node:os';
import { readdir } from 'node:fs/promises';
import { CommandsOperation } from '../operation/CommandsOperation.js';

export class NavigationWorkDir extends CommandsOperation {

  async handleCommand(command, args) {
    const curCommand = command;
    const curArgs = [...args];
    // console.log(curCommand);
    switch (curCommand) {
      case 'cd': {
        const str = curArgs.join(' ').replaceAll('\'', '').replaceAll('\"', '');
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
        if (curArgs.length) {
          process.stdout.write(`Incorrect arguments, please enter only <up> command` + EOL);
          break;
        }
        process.chdir('../');
        break;
      }
      case 'ls': {
        if (curArgs.length) {
          process.stdout.write(`Incorrect arguments, please enter only <ls> command` + EOL);
          break;
        }
        await this.showDirContent();
        break;
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
