import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { EOL } from 'node:os';
import { CommandsOperation } from '../operation/CommandsOperation.js';

export class HashOperation extends CommandsOperation {

  async handleCommand(args) {
    try {
      const curArgs = [...args];
      if (!curArgs.length || curArgs.length > 1) {
        process.stdout.write(`Incorrect arguments, please enter only <filename> after command` + EOL);
        return;
      }

      const handlePath = this.handlePath(curArgs.pop());
      const filePath = resolve(process.cwd(), handlePath);
      const contentFile = await readFile(filePath, { encoding: 'utf8' });
      const hashSum = createHash('sha256');
      hashSum.update(contentFile);
      console.log(hashSum.digest('hex'));
    } catch (error) {
      process.stdout.write(this.failMessage + EOL);
    }
  }
}
