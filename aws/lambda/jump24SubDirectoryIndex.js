'use strict';

/**
 * Implementing Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins Using Lambda@Edge
 * @uses CloudFront Event: Origin Request (Include body: No)
 *
 * @link https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 */
const pointsToFile = uri => /\/[^/]+\.[^/]+$/.test(uri);
const hasTrailingSlash = uri => uri.endsWith('/');
const needsTrailingSlash = uri => !pointsToFile(uri) && !hasTrailingSlash(uri);

exports.handler = (event, context, callback) => {
    // Extract the request from the CloudFront event that is sent to Lambda@Edge
    var request = event.Records[0].cf.request;

    // Extract the URI and query string from the request
    const olduri = request.uri;
    const qs = request.querystring;

    // If needed, redirect to the same URI with trailing slash, keeping query string
    if (needsTrailingSlash(olduri)) {
        return callback(null, {
            body: '',
            status: '302',
            statusDescription: 'Moved Temporarily',
            headers: {
                location: [{
                    key: 'Location',
                    value: qs ? `${olduri}/?${qs}` : `${olduri}/`,
                }],
            }
        });
    }

    // Match any '/' that occurs at the end of a URI, replace it with a default index
    const newuri = olduri.replace(/\/$/, '\/index.html');

    // Useful for test runs
    // console.log("Old URI: " + olduri);
    // console.log("New URI: " + newuri);

    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;

    // Return to CloudFront
    return callback(null, request);
};
