import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { Command } from '@oclif/core';

import * as childProcess from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
import { lookpath } from 'lookpath';

import { validateStageEnv } from './env';
import { color } from '@oclif/color';
import { isAwsVaultInstalled } from '../lib/awsVault';
import { assertChamberInstalled, isChamberInstalled } from '../lib/chamber';

const exec = promisify(childProcess.exec);

type LoadAWSCredentialsOptions = {
  envStage: string;
  validateEnvStageVariables: boolean;
};

async function loadStageEnv(
  context: Command,
  envStage: string,
  shouldValidate = true
) {
  await assertChamberInstalled();

  let chamberOutput;
  try {
    const { stdout } = await exec(`chamber export ${envStage} --format dotenv`);
    chamberOutput = stdout;
  } catch (err) {
    context.error(
      `Failed to load environmental variables from SSM Parameter Store using chamber: ${err}`
    );
  }

  const parsed = dotenv.parse(Buffer.from(chamberOutput));
  context.log(
    `Loaded ${
      Object.keys(parsed).length
    } environmental variables from SSM Parameter Store using chamber.\n`
  );
  // @ts-ignore
  dotenv.populate(process.env, parsed);

  if (shouldValidate) {
    await validateStageEnv();
  }
}

export const initAWS = async (
  context: Command,
  options: LoadAWSCredentialsOptions
) => {
  if (await isAwsVaultInstalled()) {
    const awsVaultProfile = process.env.AWS_VAULT_PROFILE;

    const { stdout } = await exec(`aws-vault export ${awsVaultProfile}`);
    const credentials = dotenv.parse(stdout);

    // @ts-ignore
    dotenv.populate(process.env, credentials);
  }

  let awsAccountId;
  try {
    const stsClient = new STSClient();
    const { Account } = await stsClient.send(new GetCallerIdentityCommand({}));
    awsAccountId = Account;
  } catch (error) {
    context.error(
      'No valid AWS Credentials found in environment variables. We recommend installing aws-vault to securely manage AWS profiles'
    );
  }

  context.log(
    `----------
"${color.red(
      options.envStage
    )}" is set as a current environment stage. Live AWS session credentials are being used.
----------\n`
  );

  await loadStageEnv(
    context,
    options.envStage,
    options.validateEnvStageVariables
  );

  return {
    awsAccountId,
    awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  };
};