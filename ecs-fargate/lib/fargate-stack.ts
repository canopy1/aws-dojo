import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const task_def = new ecs.FargateTaskDefinition(
      this, "hello-world-td", {
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        } 
      }
    )

    const logging = new ecs.AwsLogDriver({ streamPrefix: "hello-dojo" });

    const container_def = new ecs.ContainerDefinition(
      this, "hello-world-cd", {
        image: ecs.ContainerImage.fromRegistry("public.ecr.aws/c3e3c8f0/canopy-dojo-test:latest"),
        taskDefinition: task_def,
        logging,
      }
    );

    const cluster = new ecs.Cluster(this, "hello-world-cluster", {})

    const far_service = new ecs.FargateService(this, "hello-world-fs", {
      taskDefinition: task_def,
      cluster,
      serviceName: "hello-world-fs-service",
      desiredCount: 1,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
