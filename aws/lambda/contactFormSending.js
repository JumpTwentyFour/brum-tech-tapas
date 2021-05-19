const AWS = require('aws-sdk');

const ses = new AWS.SES();

const RECEIVER = 'events@brumtechtapas.co.uk';
const SENDER = 'events@brumtechtapas.co.uk';

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
          Data: `name: ${event.name}\nemail: ${event.email}\nreason: ${event.reason}\n`,
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


exports.handler = function (event, context) {
  sendEmail(event, (err, data) => {
    context.done(err, null);
  });
};
