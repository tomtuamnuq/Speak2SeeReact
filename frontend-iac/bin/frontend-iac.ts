#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { FrontendIacStack } from "../lib/frontend-iac-stack";
import { stackName } from "../../shared/common-utils";
import { getConfig } from "../lib/config";
import { addProjectTags } from "../../shared/tagging";
import { addSecurityChecks } from "../lib/nag";

const app = new App();
// Get environment from context or default to 'dev'
const stage = app.node.tryGetContext("stage") || "dev";
const config = getConfig(stage);

const env = {
  region: config.region,
  account: config.account,
};
const frontendStack = new FrontendIacStack(app, stackName("frontend", stage), {
  websiteBucketName: config.websiteBucketName,
  removalPolicy: config.removalPolicy,
  logRetentionDays: config.logRetentionDays,
  env,
});
addProjectTags(frontendStack, config.tags);
addSecurityChecks(app, stage);
