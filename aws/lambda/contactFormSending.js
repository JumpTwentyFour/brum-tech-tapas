const AWS = require('aws-sdk');

const ses = new AWS.SES();

const RECEIVER = 'brumtechtapas@jump24.co.uk';
const SENDER = 'brumtechtapas@jump24.co.uk';

const response = {
  isBase64Encoded: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'example.com',
  },
  statusCode: 200,
  body: '{"result": "Success."}',
};

exports.handler = function (event, context) {
  console.log('Received event:', event);
  sendEmail(event, (err, data) => {
    context.done(err, null);
  });
};

function sendEmail(event, done) {
  const params = {
    Destination: {
      ToAddresses: [
        RECEIVER,
      ],
    },
    Message: {
      Body: {
        Text: {
          Data: `name: ${event.name}\nphone: ${event.phone}\nemail: ${event.email}\ndesc: ${event.desc}`,
          Charset: 'UTF-8',
        },
      },
      Subject: {
        Data: `Brum Tech Tapas Contact: ${event.name}`,
        Charset: 'UTF-8',
      },
    },
    Source: SENDER,
  };
  ses.sendEmail(params, done);
}
