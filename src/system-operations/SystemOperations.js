import { EOL, cpus, homedir, userInfo, arch } from 'node:os';
import { CommandsOperation } from '../operation/CommandsOperation.js';

export class SystemOperations extends CommandsOperation {

  async handleCommand(args) {
    try {
      const curArgs = [...args];
      if (!curArgs.length || curArgs.length > 1) {
        process.stdout.write(`Incorrect arguments, please enter only one command with prefix <--> after command` + EOL);
        return;
      }
      const command = curArgs.pop().trim().slice(2).toLowerCase();
      switch (command) {
        case 'eol': {
          process.stdout.write(JSON.stringify(EOL));
          process.stdout.write(EOL);
          break;
        }

        case 'cpus': {
          const response = this.formatCpusResult(cpus());
          console.log(response);
          break;
        }

        case 'homedir': {
          const result = homedir();
          console.log(result);
          break;
        }

        case 'username': {
          const result = userInfo().username;
          console.log(result);
          break;
        }

        case 'architecture': {
          const result = arch();
          console.log(result);
          break;
        }
        default:
          process.stdout.write(`Unknown operation, please enter another operation with prefix <--> after command` + EOL);
          break;
      }
    } catch (error) {
      process.stdout.write(this.failMessage + error.message + EOL);
    }
  }

  formatCpusResult(result) {
    const response = result.reduce((acc, cur) => {
      return [...acc, { model: cur.model.split(' @ ')[0], speed: `${cur.speed / 1000} GHz` }];
    }, []);

    return response;
  }
}
