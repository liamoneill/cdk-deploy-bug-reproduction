#!/usr/bin/env node

import 'source-map-support/register';
import path = require('path');
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { AssetHashType } from 'aws-cdk-lib';

class StackA extends cdk.Stack {
  functionA: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.functionA = new Function(this, 'Function', {
      functionName: 'function-a',
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda-handler')),
    });
  }
}

class StackB extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps, functionA: Function) {
    super(scope, id, props);

    new Function(this, 'Function', {
      functionName: 'function-b',
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda-handler')),
      environment: {
        FUNCTION_A: functionA.functionArn
      }
    });
  }
}

const app = new cdk.App();
const stackA = new StackA(app, 'StackA', {});
new StackB(app, 'StackB', {}, stackA.functionA);

app.synth()
