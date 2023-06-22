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

export const parseCommandLine = (data) => {
  const commandLine = data.trim();
  if (!commandLine) return { command: '', args: [], flag: 'unknown' };
  const [command, ...args] = commandLine.split(' ');
  const curArgs = args.length ? args.join(' ').trim().split(' ') : args;
  const flag = chooseFlag(command);

  return { command, args: curArgs, flag: flag || 'unknown' };
};
