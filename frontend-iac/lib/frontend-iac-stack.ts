import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  AccessLevel,
  AllowedMethods,
  CachePolicy,
  Distribution,
  GeoRestriction,
  PriceClass,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
interface FrontendStackProps extends StackProps {
  websiteBucketName: string;
  removalPolicy: RemovalPolicy;
  logRetentionDays: number;
}

export class FrontendIacStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);
    const autoDeleteObjects = props.removalPolicy === RemovalPolicy.DESTROY;
    // Create access logs bucket for S3
    const s3AccessLogsBucket = new Bucket(this, "S3AccessLogsBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: props.removalPolicy,
      autoDeleteObjects: autoDeleteObjects,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      lifecycleRules: [
        {
          expiration: Duration.days(props.logRetentionDays),
        },
      ],
    });

    // Create S3 bucket with enhanced security settings
    const websiteBucket = new Bucket(this, "WebsiteBucket", {
      bucketName: props.websiteBucketName,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: props.removalPolicy,
      autoDeleteObjects: autoDeleteObjects,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      serverAccessLogsBucket: s3AccessLogsBucket,
      serverAccessLogsPrefix: "website-bucket-logs/",
      lifecycleRules: [
        {
          noncurrentVersionExpiration: Duration.days(props.logRetentionDays),
          noncurrentVersionsToRetain: 1,
        },
      ],
    });
    const s3Origin = S3BucketOrigin.withOriginAccessControl(websiteBucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    // Cache policy for static assets (JS, CSS, images) and HTML files
    const staticAssetsCachePolicy = new CachePolicy(this, "StaticAssetsCache", {
      minTtl: Duration.days(1),
      maxTtl: Duration.days(365),
      defaultTtl: Duration.days(1),
    });
    // Create access logs bucket for CloudFront
    const cloudFrontLogsBucket = new Bucket(this, "CloudFrontLogsBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: props.removalPolicy,
      autoDeleteObjects: autoDeleteObjects,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      serverAccessLogsBucket: s3AccessLogsBucket,
      serverAccessLogsPrefix: "cloudfront-bucket-logs/",
      lifecycleRules: [
        {
          expiration: Duration.days(props.logRetentionDays),
        },
      ],
    });
    const distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: staticAssetsCachePolicy,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      geoRestriction: GeoRestriction.allowlist("DE"), // Restrict to Germany
      priceClass: PriceClass.PRICE_CLASS_100, // Europe, North America and Israel
      logBucket: cloudFrontLogsBucket,
    });

    new BucketDeployment(this, "DeployWebsite", {
      sources: [Source.asset("../dist")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
      memoryLimit: 128,
      logGroup: new LogGroup(this, id, {
        removalPolicy: props.removalPolicy,
        retention: props.logRetentionDays,
      }),
    });

    new CfnOutput(this, "WebsiteUrl", {
      value: `https://${distribution.domainName}`,
      description: "Website URL",
    });
  }
}
