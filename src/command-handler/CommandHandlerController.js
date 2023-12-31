import { EOL } from 'node:os';
import { BasicOperationWithFile } from '../basic-operation/BasicOperationWithFile.js';
import { SystemOperations } from '../system-operations/SystemOperations.js';
import { NavigationWorkDir } from '../navigation/NavigationWorkDir.js';
import { parseCommandLine } from '../utils/parseCommandLine.js';
import { HashOperation } from '../hash/HashOperation.js';
import { ArchiveOperations } from '../zip/ArchiveOperations.js';

export class CommandHandlerController {
  constructor() {
    this.commandLine = null;
    this.rootDir = process.cwd().slice(0, 3);
    this.failMessage = 'Operation failed: ';
    this.navigationCLI = new NavigationWorkDir();
    this.basicOperations = new BasicOperationWithFile();
    this.systemOperations = new SystemOperations();
    this.hashOperation = new HashOperation();
    this.archiveOperations = new ArchiveOperations();
  }

  async start(data) {
    this.commandLineObj = parseCommandLine(data);
    await this.chooseHandler(this.commandLineObj);
    this.showCurrentWorkDir();
  }

  showCurrentWorkDir() {
    process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
  }

  async chooseHandler(commandLineObj) {
    try {
      const { command, args, flag } = commandLineObj;

      switch (flag) {
        case 'navigation': {
          await this.navigationCLI.handleCommand(command, args);
          break;
        }
        case 'basic': {
          await this.basicOperations.handleCommand(command, args);
          break;
        }

        case 'system': {
          await this.systemOperations.handleCommand(args);
          break;
        }

        case 'hash': {
          await this.hashOperation.handleCommand(args);
          break;
        }

        case 'archive': {
          await this.archiveOperations.handleCommand(command, args);
          break;
        }

        case 'exit': {
          process.exit();
        }

        default:
          process.stdout.write(`Unknown operation, please enter another command` + EOL);
          break;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}
