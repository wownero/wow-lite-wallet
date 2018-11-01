# Wownero Light Wallet :computer: :two_hearts: :ok_hand:

An experimental crypto wallet for Wownero. Possibly the worst ever made. 100% WOW.

- Electron/Vue.js
- Remote node only
- Linux/Windows/OSX
- Integration with [WFS](https://funding.wownero.com)
- USD/WOW conversion

## Compile :two_men_holding_hands:

Requirements:

- Node v8 :-1:
- Wownero on tag `v0.3.1.1` :fire:
- A patch to the above git tag :sunglasses:

#### Electron :sob:

Clone this repo and install npm packages:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
```

If `npm run dev` works, you can install a custom version of `wownero-wallet-cli` :alien:

#### wownero-wallet-cli :star2:

```
git clone https://github.com/wownero/wownero.git
cd wownero
git checkout tags/v0.3.1.1
git apply light_patch.diff
make -j4
```

Use `light_patch.diff` that's included in this repository. :two_women_holding_hands:

If it compiled successfully; you can move the binary into the resources folder:

```
cp build/release/bin/wownero-wallet-cli wowlight/resources/linux/bin/wowlight
```

Build the light wallet:

```
npm run build
```

Resulting build will go into `build/`

### Technical

This GUI is a wrapper for a custom `wownero-wallet-cli`. `stdout` is parsed with Regex. What can go wrong :scream: ?

The code base is one big spaghetti. 100% WOW.

### License

© 2018 WTFPL – Do What the Fuck You Want to Public License