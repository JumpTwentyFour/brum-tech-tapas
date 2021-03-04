

/**
 * Basic HTTP Authentication for S3 and CloudFront with Lambda@Edge
 * @uses CloudFront Event: Viewer Request (Include body: No)
 *
 * @link https://medium.com/hackernoon/serverless-password-protecting-a-static-website-in-an-aws-s3-bucket-bfaaa01b8666
 */
exports.handler = (event, context, callback) => {
  // Get request and request headers
  const { request } = event.Records[0].cf;
  const { headers } = request;

  // Configure authentication
  const authUser = 'jump24';
  const authPass = 'preview';

  // Construct the Basic Auth string
  const authString = `Basic ${new Buffer(`${authUser}:${authPass}`).toString('base64')}`;

  // Require Basic authentication
  if (typeof headers.authorization === 'undefined' || headers.authorization[0].value != authString) {
    const body = 'Unauthorized';
    const response = {
      status: '401',
      statusDescription: 'Unauthorized',
      body,
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }],
      },
    };
    callback(null, response);
  }

  // Continue request processing if authentication passed
  callback(null, request);
};
