#! /usr/bin/env node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common/helpers/decryptSecrets');
const executeCommands = require('@hollowverse/common/helpers/executeCommands');

const { ENC_PASS_SUMO, IS_PULL_REQUEST } = shelljs.env;

const isPullRequest = IS_PULL_REQUEST !== 'false';

const secrets = [
  {
    password: ENC_PASS_SUMO,
    decryptedFilename: 'sumo.json',
  },
];

async function main() {
  const buildCommands = ['yarn test', 'yarn server/build', 'yarn client/build'];

  const deploymentCommands = [() => decryptSecrets(secrets, './secrets')];

  let commands;
  if (isPullRequest === false) {
    commands = [...buildCommands, ...deploymentCommands];
  } else {
    commands = buildCommands;
    console.info('Skipping deployment commands in PRs');
  }

  const code = await executeCommands(commands);

  process.exit(code);
}

main();
