const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions();
const {double} = require('./handler')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTaskStatus(input, taskToken) {
    let output
    try {
        output = await double(input.number)
        console.log(`This is output: ${output}`)
        
        await stepfunctions
        .sendTaskSuccess({
        output: JSON.stringify({
            number: output
        }),
        taskToken: taskToken,
        })
        .promise();
    }
    catch(e)  {
        await stepfunctions.sendTaskFailure({
            cause: e.message,
            error: e.name,
            taskToken: taskToken
        }).promise();
    }
    return JSON.stringify({
        number: output
    })
}

module.exports.sqs = async (event) => {
  await sleep(2000);
  console.log(JSON.stringify(event));
  const {input, Token} = JSON.parse(event.Records[0].body);
  return await sendTaskStatus(input, Token)
};

module.exports.callback_lambda = async (event) => {
  await sleep(1000);
  console.log(JSON.stringify(event));
  const {input, Token} = event;
  return await sendTaskStatus(input, Token)
  
};

module.exports.sns = async (event) => {
  await sleep(1000);
  console.log(JSON.stringify(event));
  const {input, Token} = JSON.parse(event.Records[0].Sns.Message);
  return await sendTaskStatus(input, Token)
};
