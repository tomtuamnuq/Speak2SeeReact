import { RemovalPolicy } from "aws-cdk-lib";
import { ProjectTags } from "../../shared/tagging";

interface FrontendConfig {
  readonly stage: string;
  readonly region: string;
  readonly account: string;
  readonly websiteBucketName: string;
  readonly removalPolicy: RemovalPolicy;
  readonly tags: ProjectTags;
  readonly logRetentionDays: number;
}

export function getConfig(stage: string): FrontendConfig {
  const configs: { [key: string]: FrontendConfig } = {
    dev: {
      stage: "dev",
      region: "eu-west-2",
      account:
        process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT!,
      websiteBucketName: "tuamnuq-speak2see-website-dev",
      removalPolicy: RemovalPolicy.DESTROY,
      logRetentionDays: 30,
      tags: {
        project: "Speak2See",
        costCenter: "Speech-Applications",
        environment: "Development",
      },
    },
  };

  return configs[stage];
}
