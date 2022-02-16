# uccontrol

[Electron](https://electronjs.org/) + [React](https://reactjs.org/) + [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)

**Note**: requires Node.js = 14.16.1

## Install

First, clone the repo via git:

```bash
git clone https://github.com/Jhony0709/uccontrol.git
```

Then, cd into repo dir and install dependencies with npm:

```bash
cd uccontrol && npm i
```

Finally, rebuild Note Native Modules (nfc-pcsc) using this command:

```bash
npm run rebuild
```

## Run

Run this two commands **simultaneously** in different console tabs. (client and server)

```bash
npm start
node .
```

**If you install new dependencies,
you have to rebuild Note Native Modules (nfc-pcsc) against Electron's Node.js version.**  
Run the following command:

```bash
npm run rebuild
```
