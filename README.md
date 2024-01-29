# AI Guest DJ Roon Extension

This is the repository for a [Roon](https://roon.app/) extension to work with [AI Guest DJ](https://aiguestdj.com). Using this extension you can match the songs in your library with the playlist created by the AI Guest DJ GPT.

<p align="center"><a href="https://aiguestdj.com" target="_blank" rel="noopener noreferrer"><img width="100" src="https://aiguestdj.com/img/logo.png" alt="AI Guest DJ logo"></a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/next"><img src="https://img.shields.io/node/v/next.svg?sanitize=true" alt="Version"></a>
</p>

------------

## Docker installation

The easiest way to use this extension is by starting a docker container. Once up and running you will find the instance at http://[ipaddress]:9010. You can change the port number by setting the `PORT` environment variable.

```sh
docker run -d \
    -e PORT=9010 \
    --name=aiguestdj-roon \
    --network=host \
    --restart on-failure:4 \
    aiguestdj/roon-extension
```

## Manual installation

AI Guest DJ is built using [NextJS](https://nextjs.org/) so you should be running `node 18` or higher. You can install and run this extension in two different ways.

### Local

To install it in a specific folder/project run the following command.

```sh
npm install @aiguestdj/roon-extension
```

To start it use the `npx` command.

```sh
npx aiguestdj-roon
```

### Global

To install it globally on your machine, run the following command.

```sh
npm install @aiguestdj/roon-extension -g
```

To start the roon extension run the following command. Once up and running you will find the instance at http://[ipaddress]:9010. 

```sh
aiguestdj-roon
```

### Change Port number

You can change the port number by setting the `PORT` environment variable.

```sh
PORT=9020 aiguestdj-roon
```

## Development

The extension is build using NextJS. So you can also checkout this repo and simply use the next commands like `npm run dev`, `npm run build` and `npm run start`.
