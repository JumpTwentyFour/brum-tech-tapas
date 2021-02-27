'use strict';

/**
 * Adding security headers to responses from CloudFront with Lambda@Edge
 * @uses CloudFront Event: Origin Response
 *
 * @link https://aws.amazon.com/blogs/networking-and-content-delivery/adding-http-security-headers-using-lambdaedge-and-amazon-cloudfront/
 * @link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses-in-requests.html
 * @link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-header-restrictions
 */
exports.handler = async (event) => {
  // Get headers for our response so we can add to them
  const response = event.Records[0].cf.response;

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   */
  response.headers['content-security-policy'] = [{
    key: 'Content-Security-Policy',
    value: "default-src 'none'; base-uri 'self'; connect-src 'self' https://performance.typekit.net https://www.google-analytics.com; font-src 'self' data: https://use.typekit.net; form-action 'self'; frame-ancestors 'self'; frame-src 'self'; img-src 'self' data: https://p.typekit.net https://www.google-analytics.com; media-src 'self'; object-src 'none'; script-src 'self' 'sha256-jEKeIZhl4a389+P5khwn9QmdZoDUXNSlnXFcMMiAgKE=' 'sha256-P8uWzx7pLBxmCA9WLO74dc29z9uHZ9SjiXeqjj3+F14=' https://use.typekit.net https://www.google-analytics.com https://ssl.google-analytics.com; style-src 'self' 'unsafe-inline' https://p.typekit.net https://use.typekit.net"
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
   */
  response.headers['cross-origin-embedder-policy'] = [{
    key: 'Cross-Origin-Embedder-Policy',
    value: 'unsafe-none'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
   */
  response.headers['cross-origin-opener-policy'] = [{
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
   */
  response.headers['cross-origin-resource-policy'] = [{
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT
   */
  response.headers['expect-ct'] = [{
    key: 'Expect-CT',
    value: 'max-age=86400'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
   * @link https://github.com/w3c/webappsec-permissions-policy/blob/master/permissions-policy-explainer.md
   */
  response.headers['permissions-policy'] = [{
    key: 'Permissions-Policy',
    value: "accelerometer=(), camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
   */
  response.headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'same-origin'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server
   */
  response.headers['server'] = [{
    key: 'Server',
    value: ''
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
   */
  response.headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubdomains; preload'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
   */
  response.headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
   */
  response.headers['x-dns-prefetch-control'] = [{
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#Security
   */
  response.headers['x-download-options'] = [{
    key: 'X-Download-Options',
    value: 'noopen'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
   */
  response.headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#Security
   */
  response.headers['x-permitted-cross-domain-policies'] = [{
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  }];

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
   */
  response.headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }];

  // Return modified response
  return response;
};
