import { App, Aspects, Stack } from "aws-cdk-lib";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";

/**
 * Applies AWS Solutions security checks and suppressions to the app
 */
export function addSecurityChecks(app: App, stage: string): void {
  // Add AWS Solutions security pack
  Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
  if (stage === "dev") {
    // Apply dev suppressions after all stacks are created
    applyDevSuppressions(app);
  }
}
function applyDevSuppressions(app: App) {
  const stacks = app.node.children.filter((child) => child instanceof Stack);
  stacks.forEach((stack) => {
    if (stack.node.id.includes("frontend")) {
      NagSuppressions.addStackSuppressions(stack, [
        {
          id: "AwsSolutions-IAM4",
          reason:
            "Development environment allows use of AWS managed policies for simplicity",
        },
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Development environment allows wildcard permissions for testing",
        },
        {
          id: "AwsSolutions-CFR2",
          reason:
            "Development environment does not require WAF for cost optimization",
        },
        {
          id: "AwsSolutions-L1",
          reason:
            "Lambda runtime version is managed by CDK's BucketDeployment construct and cannot be configured",
        },
        {
          id: "AwsSolutions-CFR4",
          reason:
            "Development environment uses default CloudFront certificate to save costs",
        },
      ]);
    }
  });
}
