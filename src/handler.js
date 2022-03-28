const aws = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const { NumberIsTooBig } = require("../libs/Errors");

module.exports.add = async ({ x, y }) => {
  return x + y;
};

module.exports.subtract = async ({ x, y }) => {
  return Math.abs(x - y);
};

module.exports.double = async (n) => {
  if (n>50) {
     throw new NumberIsTooBig(n)
  }
  return n*2
};

module.exports.doubleBigNumber = async (n) => {
  return n*2
};

const triggerStateMachine = async (event) => {
  try {
    params = {
      stateMachineArn: process.env.statemachine_arn,
      input: JSON.stringify(event.body)
    }
    const stepfunctions = new aws.StepFunctions()
    return await stepfunctions.startExecution(params).promise()
  }
  catch (error){
    console.error(error);
    throw new Error(error.message);
  }
  
};

module.exports.triggerhandler = middy(triggerStateMachine)
  .use(httpJsonBodyParser()) 

