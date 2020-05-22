## Compile

Requirements:

- Node v8
- Latest Wownero (CLI) + `git apply light_diff.patch`

#### Electron

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev
```

If `npm run dev` works, you can install a custom version of `wownero-wallet-cli`

#### wownero-wallet-cli :star2:

```
git clone https://github.com/wownero/wownero.git
cd wownero
git checkout <latest version here>
git apply light_patch.diff
make -j4
```

Use `light_patch.diff` that's included in this repository. Move resulting binary into the resources folder:

```
cp build/release/bin/wownero-wallet-cli wowlite/resources/linux/bin/wowlite
```

Build the light wallet:

```
npm run build
```