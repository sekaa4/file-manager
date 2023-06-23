import { basename, resolve } from 'node:path';
import { EOL } from 'node:os';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { CommandsOperation } from '../operation/CommandsOperation.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export class ArchiveOperations extends CommandsOperation {

  async handleCommand(command, args) {
    try {
      const curArgs = [...args];
      if (!curArgs.length || curArgs.length !== 2) {
        process.stdout.write(`Incorrect arguments, please enter <path_to_file path_to_destination> after command` + EOL);
        return;
      }

      switch (command) {
        case 'compress': {
          await this.createPipeline(curArgs, command);
          break;
        }

        case 'decompress': {
          await this.createPipeline(curArgs, command);
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

  async createPipeline(args, flag) {
    const [pathFileStr, pathStrNewDir] = args;
    const pathToFile = resolve(process.cwd(), pathFileStr);
    const baseNameFile = basename(pathToFile);
    let newFileName;

    if (flag === 'compress') {
      newFileName = baseNameFile + '.br';
    } else {
      const isCompressFile = baseNameFile.lastIndexOf('.br') !== -1;
      if (isCompressFile) {
        newFileName = baseNameFile.slice(0, baseNameFile.lastIndexOf('.br'));
      } else throw new Error('File doesn\'t exist or compress with Brotli algorithm');
    }
    const pathToNewDir = resolve(process.cwd(), pathStrNewDir, newFileName);
    const readStream = createReadStream(pathToFile);
    const writeStream = createWriteStream(pathToNewDir, { flags: 'wx' });

    const brotliStream = flag === 'compress' ? createBrotliCompress() : createBrotliDecompress();

    await pipeline(readStream, brotliStream, writeStream);
  }
}
