# AI Guest DJ Roon Extension

This is the repository for a [Roon](https://roon.app/) extension to work with [AI Guest DJ](https://aiguestdj.com). Using this extension you can match the songs in your library with the playlist created by the AI Guest DJ GPT.

<p align="center"><a href="https://aiguestdj.com" target="_blank" rel="noopener noreferrer"><img width="100" src="https://aiguestdj.com/img/logo.png" alt="AI Guest DJ logo"></a></p>

<p align="center">
  <a href="https://www.npmjs.com/package/next"><img src="https://img.shields.io/node/v/next.svg?sanitize=true" alt="Version"></a>
</p>

------------

## Extension Manager installation

The fastest and easiest way to install this extension is using the [Roon Extension Manager](https://github.com/TheAppgineer/roon-extension-manager). Here you can insttall the extension, during the installation you will need to input the environment variables:

**PORT**
> This is the portnumber you want to use to access the AI Guest DJ extension (default: 9010)

**OPEN_AI_KEY**
> This is in optional environment variable that allows you to connect with your own Open AI API Key

## Docker installation

Another easy way to use this extension is by starting a docker container. Once up and running you will find the instance at http://[ipaddress]:9010. You can change the port number by setting the `PORT` environment variable.

### Open AI API key

Your Open AI API key is stored as an environment variable of the docker instance. You can find your API keys in your [User settings of Open AI](https://platform.openai.com/api-keys). If you don't have an API key you can remove this line.

To use your own Open AI API key you will need to setup your billing account in Open AI. It is not sufficient to only have a ChatGPT Plus account.

### Binding volume

Binding a volume to the `/app/config` folder enables persistant storage of the configuration files. Currently the configuration is used to monitor the last requests made to Open AI. If you don't want to use persistant storage you can remove this line.

```sh
docker run -d \
    -e PORT=9010 \
    -e OPENAI_KEY=PASTE_YOUR_OPEN_AI_API_KEY_HERE \
    -v /local/directory/:/app/config:rw \
    --name=aiguestdj-roon \
    --network=host \
    --restart on-failure:4 \
    aiguestdj/roon-extension
```

## Portainer installation

Create a new stack with the following configuration when using portainer.

```yaml
version: '3.3'
services:
    aiguestdj-roon:
        container_name: aiguestdj-roon
        restart: unless-stopped
        volumes:
            - '/local/directory:/app/config'
        environment:
            - PORT=9010
            - OPENAI_KEY=PASTE_YOUR_OPEN_AI_API_KEY_HERE
        network_mode: "host"
        image: 'aiguestdj/roon-extension:latest'
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

### Add OpenAI Key

You can add your OpenAI API Key by setting the `OPENAI_KEY` environment variable.

```sh
OPENAI_KEY=PASTE_YOUR_OPEN_AI_API_KEY_HERE aiguestdj-roon
```

### Change Port number

You can change the port number by setting the `PORT` environment variable.

```sh
PORT=9020 aiguestdj-roon
```
