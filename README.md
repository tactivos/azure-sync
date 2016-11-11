# azure-sync
Azure storage file synchronizer

### How to use it

There are two different ways to use this repo:

#### As a function, ex:

```js
const config = 'your-config';
const sync = require('azure-sync');
const path = require('path');
const chalk = require('chalk');

const azure_conf = {
  account: config.azure.storage.account,
  accessKey: config.azure.storage.accessKey,
  container: {
    name: config.azure.storage.container.name,
    properties: config.azure.container.properties,
    policy: config.azure.container.policy
  },
  progress: false,
  sources: [`${path.resolve('static')}/**`, `${path.resolve('dist')}/**`],
  verbose: false
};

sync(azure_conf)
.then(() => console.log(chalk.yellow(`Finished`)))
.catch(err => console.log(chalk.red(`Error found when azure-syncing: ${err}`)));
```

#### Via CLI:

```zsh
AZURE_STORAGE_ACCOUNT=your-account AZURE_STORAGE_ACCESS_KEY=your-access-key (...) node ./node_modules/azure-sync/dist
```

### Configuration

#### As a function

Call the module with this params structure. EX:

```js
const config = {
  "account": "<your-azure-account>",
  "accessKey": "<your-azure-access-key>",
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
  account: process.env.AZURE_STORAGE_ACCOUNT,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  container: {
    name: process.env.AZURE_SYNC_CONTAINER_NAME,
    properties: process.env.AZURE_SYNC_CONTAINER_PROPERTIES,
    policy: process.env.AZURE_SYNC_CONTAINER_POLICY
  },
  progress: process.env.AZURE_SYNC_PROGRESS,
  source: process.env.AZURE_SYNC_SOURCE,
  verbose: process.env.AZURE_SYNC_VERBOSE
};
```

Cheers 🤖
