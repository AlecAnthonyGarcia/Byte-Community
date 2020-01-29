# Byte Community

Immerse yourself in the [byte](https://byte.co/) universe: an exciting new looping video app from the founder of Vine.

Explore, watch, and share bytes on the web.

<img src="https://user-images.githubusercontent.com/2003684/73318823-61155a80-41ef-11ea-8637-0d4a25760b4f.png">

## Available Scripts

In the /client directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

In the /server directory, you can run:

### `npm start`

Runs an Express server that serves the React bundle.<br>
Open http://localhost:3001 to view it in the browser.

The server is needed for dynamically replacing the Open Graph meta tags so that the correct meta data appears when a link is shared on social media such as Facebook and Twitter.

The server also proxies API requests from the React client to the unofficial byte API.

### API Authentication

In order for the application to work correctly you need to add your own authorization token.

The authorization token is used to authenticate each request to the byte API and without it the requests will fail. You'll need to find out how to get your own authorization token by yourself.

The server uses round-robin iteration to cycle through different authorization tokens to balance the load on the byte API requests. You can supply as many authorization tokens as you want, but there must be at least one.

- In server/api/index.js:

```
const authorizationTokens = ['']; // TODO: add your own authorization tokens

```

# License

MIT

## Legal

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Interspace Technologies, Inc. d.b.a. Byte or any of its affiliates or subsidiaries. This is an independent project that utilizes byte's unofficial APIs. Use at your own risk.
