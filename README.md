# Wownero Light

An experimental crypto wallet for Wownero. Possibly the worst ever made.

- Electron/Vue.js
- Remote node only
- Sub-addresses
- Linux/Windows/OSX
- Integration with WFS system
- Supports network wrappers (torsocks/torify/proxychains)

*note*: To other cryptonote projects looking to fork this; I would recommend against it.

### Technical

It is essentially a wrapper for `wownero-wallet-cli`. `stdout` is parsed with Regex. What can go wrong?

### Compile

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
```