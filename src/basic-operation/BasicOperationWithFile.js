import { resolve, basename, dirname } from 'node:path';
import { EOL } from 'node:os';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { open, writeFile, rename, rm, access } from 'node:fs/promises';
import { CommandsOperation } from '../operation/CommandsOperation.js';

export class BasicOperationWithFile extends CommandsOperation {

  async handleCommand(command, args) {
    try {
      const curCommand = command;
      const curArgs = [...args];
      switch (curCommand) {
        case 'cat': {
          const [pathString] = curArgs;
          const handlePath = this.handlePath(pathString);

          const path = resolve(process.cwd(), handlePath);
          const readStream = new Promise((resolve, reject) => {
            const input = createReadStream(path, { encoding: 'utf8' });
            input.pipe(process.stdout);

            input.on('error', (error) => {
              reject(error);
            });

            input.on('end', () => {
              input.close();
              process.stdout.write(EOL);
              process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
            });
          });

          await readStream;

          break;
        }

        case 'add': {
          if (!curArgs.length || curArgs.length > 1) {
            process.stdout.write(`Incorrect arguments, please enter <filename> after command` + EOL);
            break;
          }
          const [pathString] = curArgs;
          const handlePath = this.handlePath(pathString);
          const path = resolve(process.cwd(), handlePath);
          await writeFile(path, '', { flag: 'wx' });
          break;
        }

        case 'rn': {
          if (!curArgs.length || curArgs.length !== 2) {
            process.stdout.write(`Incorrect arguments, please enter <path_to_file and new_filename> after command` + EOL);
            break;
          }

          const [pathString, name] = curArgs;
          const path = resolve(process.cwd(), this.handlePath(pathString));
          const __dirname = dirname(path);
          const handleName = this.handlePath(name);
          const newFileNamePath = resolve(__dirname, handleName);

          const isExist = await access(resolve(__dirname, newFileNamePath)).then(() => true).catch(() => false);

          if (isExist) {
            process.stdout.write(`File <${handleName}> already exist, please enter another name` + EOL);
            break;
          }

          await rename(path, newFileNamePath);
          break;
        }

        case 'rm': {
          if (!curArgs.length || curArgs.length !== 1) {
            process.stdout.write(`Incorrect arguments, please enter <path_to_file and new_filename> after command` + EOL);
            break;
          }
          const [pathString] = curArgs;
          const path = resolve(process.cwd(), this.handlePath(pathString));
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
    const pathToFile = resolve(process.cwd(), this.handlePath(pathFileStr));
    const newFileName = basename(pathToFile);
    const pathToNewDir = resolve(process.cwd(), this.handlePath(pathStrNewDir), newFileName);
    const readStream = createReadStream(pathToFile, { encoding: 'utf8' });
    const writeStream = createWriteStream(pathToNewDir, { flags: 'wx' });

    await pipeline(readStream, writeStream);

    if (isDeleteFile) {
      await rm(pathToFile, { recursive: true });
    }
  }
}
