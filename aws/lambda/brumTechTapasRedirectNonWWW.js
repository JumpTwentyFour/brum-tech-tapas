

/**
 * Redirect www.brumtechtapas.co.uk to brumtechtapas.co.uk
 * @uses CloudFront Event: Viewer Request (Include body: No)
 */
exports.handler = async (event) => {
  const { request } = event.Records[0].cf;

  if (request.headers.host[0].value === 'www.brumtechtapas.co.uk') {
    return {
      status: '301',
      statusDescription: 'Redirecting to apex domain',
      headers: {
        location: [{
          key: 'Location',
          value: `https://brumtechtapas.co.uk${request.uri}`,
        }],
      },
    };
  }

  return request;
};
