export class CommandsOperation {
  constructor() {
    this.rootDir = process.env.HOMEDRIVE;
    this.failMessage = 'Operation failed';
  }

  handlePath(path) {
    return path.replaceAll('\'', '').replaceAll('\"', '');
  }
}
