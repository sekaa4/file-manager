const flagsObj = {
  navigation: ['cd', 'up', 'ls'],
  basic: ['cat', 'add', 'rn', 'rm', 'cp', 'mv'],
  system: ['os'],
  hash: ['hash'],
  archive: ['compress', 'decompress'],
  exit: ['.exit']
};

const chooseFlag = (command) => {
  const flag = Object.keys(flagsObj).find(flag => flagsObj[flag].includes(command));
  return flag;
};

const buildArgs = (args) => {
  const stack = [];
  let str = '';

  const parsedArgs = args.reduce((acc, cur, curIndex) => {
    let flag = false;

    if (cur === '\'' && !stack.length) {
      stack.push(cur);
      flag = true;
    }

    if (cur === '\'' && stack.length && !flag) {
      stack.pop();
    }

    if (cur === ' ' && !stack.length) {
      acc.push(str);
      str = '';
      return acc;
    }

    str += cur;
    if (curIndex === args.length - 1) {
      acc.push(str);
    }
    return acc;
  }, []);

  return parsedArgs;
};

export const parseCommandLine = (data) => {
  const commandLine = data.trim();
  if (!commandLine) return { command: '', args: [], flag: 'unknown' };
  const [command, ...args] = commandLine.split(' ');
  let curArgs = args;

  if (args.length) {
    const curSplitArgs = args.join(' ').trim().replaceAll('\"', '\'').split('');
    const isExistQuote = curSplitArgs.some((arg) => arg.includes('\''));

    if (isExistQuote) curArgs = buildArgs(curSplitArgs);
  }

  const flag = chooseFlag(command);

  return { command, args: curArgs, flag: flag || 'unknown' };
};
