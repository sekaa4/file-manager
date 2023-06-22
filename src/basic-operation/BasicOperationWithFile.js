import { resolve, basename } from 'node:path';
import { EOL } from 'node:os';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { open, writeFile, rename, rm } from 'node:fs/promises';
import { CommandsOperation } from '../operation/CommandsOperation.js';

export class BasicOperationWithFile extends CommandsOperation {

  async handleCommand(command, args) {
    try {
      const curCommand = command;
      const curArgs = [...args];
      switch (curCommand) {
        case 'cat': {
          const str = curArgs.join(' ').replaceAll('\'', '').replaceAll('\"', '');
          const path = resolve(process.cwd(), str);
          const readStream = (await open(path)).createReadStream({ encoding: 'utf8' });

          readStream.pipe(process.stdout);
          readStream.on('end', () => {
            process.stdout.write(EOL);
            readStream.close();
          });
          break;
        }

        case 'add': {
          if (!curArgs.length || curArgs.length > 1) {
            process.stdout.write(`Incorrect arguments, please enter <filename> after command` + EOL);
            break;
          }
          const path = resolve(process.cwd(), curArgs.pop());
          await writeFile(path, '', { flag: 'wx' });
          break;
        }

        case 'rn': {
          if (!curArgs.length || curArgs.length !== 2) {
            process.stdout.write(`Incorrect arguments, please enter <path_to_file and new_filename> after command` + EOL);
            break;
          }
          const [pathString, name] = curArgs;
          const path = resolve(process.cwd(), pathString);
          await rename(path, name);
          break;
        }

        case 'rm': {
          if (!curArgs.length || curArgs.length !== 1) {
            process.stdout.write(`Incorrect arguments, please enter <path_to_file and new_filename> after command` + EOL);
            break;
          }
          const [pathString] = curArgs;
          const path = resolve(process.cwd(), pathString);
          await rm(path, { recursive: true });
          break;
        }

        case 'cp': {
          const isDeleteFile = false;

          await this.createReadWriteStream(curArgs, isDeleteFile);
          break;
        }

        case 'mv': {
          if (!curArgs.length || curArgs.length !== 2) {
            process.stdout.write(`Incorrect arguments, please enter <path_to_file and path_to_new_directory> after command` + EOL);
            break;
          }
          const isDeleteFile = true;
          await this.createReadWriteStream(curArgs, isDeleteFile);
          break;
        }
        default:
          process.stdout.write(`Unknown operation, please enter another command` + EOL);
          break;
      }
    } catch (error) {
      process.stdout.write(this.failMessage + error.message + EOL);
    }
  }

  async createReadWriteStream(args, isDeleteFile) {
    if (!args.length || args.length !== 2) {
      process.stdout.write(`Incorrect arguments, please enter <path_to_file and path_to_new_directory> after command` + EOL);
      return;
    }
    const [pathFileStr, pathStrNewDir] = args;
    const pathToFile = resolve(process.cwd(), pathFileStr);
    const newFileName = basename(pathToFile);
    const pathToNewDir = resolve(process.cwd(), pathStrNewDir, newFileName);
    const readStream = createReadStream(pathToFile, { encoding: 'utf8' });
    const writeStream = createWriteStream(pathToNewDir, { flags: 'wx' });

    await pipeline(readStream, writeStream);

    if (isDeleteFile) {
      await rm(pathToFile, { recursive: true });
    }
  }
}
