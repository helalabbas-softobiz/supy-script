export const getEnvArg = (argName: string) => {
  const argIndex = process.argv.indexOf(`--${argName}`);

  const argValue = process.argv[argIndex + 1];

  return argValue;
};
