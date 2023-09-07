import { Command } from '@oclif/core';

import { initConfig } from '../../../config/init';
import { runCommand } from '../../../lib/runCommand';
import { assertDockerIsRunning } from '../../../lib/docker';

export default class BackendStripeSync extends Command {
  static description =
    'Run stripe synchronisation command inside backend docker container. Requires environmental variables with ' +
    'stripe credentials to be set.';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    await initConfig(this, { requireLocalEnvStage: true });
    await assertDockerIsRunning();

    await runCommand('docker', [
      'compose',
      'run',
      '--rm',
      '-T',
      'backend',
      'sh',
      '-c',
      'python ./manage.py djstripe_sync_models',
    ]);
  }
}