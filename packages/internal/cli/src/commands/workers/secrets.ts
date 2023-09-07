import { Command } from '@oclif/core';
import { color } from '@oclif/color';

import { initConfig } from '../../config/init';
import { assertDockerIsRunning } from '../../lib/docker';
import { runSecretsEditor } from '../../lib/secretsEditor';

export default class WebappSecrets extends Command {
  static description =
    'Runs an ssm-editor helper tool in docker container to set runtime environmental variables of workers service. ' +
    'Underneath it uses chamber to both fetch and set those variables in AWS SSM Parameter Store';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    const { envStage, awsAccountId, awsRegion } = await initConfig(this, {
      requireAws: true,
    });
    await assertDockerIsRunning();

    this.log(`Settings secrets in AWS SSM Parameter store for:
  service: ${color.green('workers')}
  envStage: ${color.green(envStage)}
  AWS account: ${color.green(awsAccountId)}
  AWS region: ${color.green(awsRegion)}
`);

    await runSecretsEditor({ serviceName: 'workers' });
  }
}