// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          ie: "11",
          edge: '17',
          firefox: '60',
          chrome: '67',
          safari: '11.1',
        },
        useBuiltIns: 'entry',
        corejs: '3.1.4',
        debug: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
  ],
};
