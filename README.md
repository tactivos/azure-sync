# azure-sync
Azure storage file synchronizer

### How to use it

There are two different ways to use this repo:

#### As a function:
	1. Import the module
	2. Call it with with the config described below (returns a promise)

#### Via CLI:
	1. Just run it (node ./node_modules/azure-sync/dist) giving the config described below as environment variables

### Configuration

#### As a function

Call the module with this params structure. EX:

```js
const config = {
  "account": "<your-azure-account>",
  "accessToken": "<your-azure-access-token>",
  "container": {
    "name": "test",
    "properties": {
      "Cors": {
        "CorsRules":  [{
          "MaxAgeInSeconds": 15,
          "AllowedOrigins": ["*"],
          "AllowedMethods": ["GET", "PUT", "OPTIONS"],
          "AllowedHeaders": ["origin", "x-ms-blob-type*", "Content-Type*"],
          "ExposedHeaders": ["origin", "x-ms-blob-type*", "Content-Type*"]
        }]
      }
    },
    "policy": {
      "publicAccessLevel" : "blob"
    }
  },
  "progress": true, // defaults to false
  "sources": [path.resolve('tmp') + '/*.js', path.resolve('tmp2') + '/*.png'], // it must be an array of paths, path.resolve works perfectly
  "verbose": true // if you want to see the current uploaded file
};
```

#### Via CLI

The env vars are mapped to the structure above like this:

```js
const ENVIRONMENT_CONFIG = {
  account: process.env.ACCOUNT,
  accessToken: process.env.ACCESS_TOKEN,
  container: {
    name: process.env.CONTAINER_NAME,
    properties: process.env.CONTAINER_PROPERTIES,
    policy: process.env.CONTAINER_POLICY
  },
  progress: process.env.PROGRESS,
  source: process.env.SOURCE,
  verbose: process.env.VERBOSE
};
```

Cheers 🤖
