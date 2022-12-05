const withTM = require("next-transpile-modules")(['@ably-labs/react-hooks'])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['ucarecdn.com', 'lh3.googleusercontent.com']
  }
})
