import { Command } from '@oclif/core';

import { initConfig } from '../../config/init';
import { runCommand } from '../../lib/runCommand';
import {assertDockerIsRunning, dockerHubLogin} from '../../lib/docker';

export default class WorkersLint extends Command {
  static description = 'Run all linters inside workers docker container';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    await initConfig(this, {});
    await assertDockerIsRunning();
    await dockerHubLogin();

    await runCommand('pnpm', [
      'nx',
      'run',
      'workers:lint',
    ]);
  }
}