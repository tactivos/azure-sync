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
    cache: config.azure.storage.container.cache,
    properties: config.azure.container.properties,
    policy: config.azure.container.policy
  },
  progress: false,
  sources: [{
    dir: `${path.resolve('dist')}`,
    pattern: '/**/*',
    include: true
  }],
  verbose: false
};

sync(azure_conf)
.then(() => console.log(chalk.yellow(`Finished`)))
.catch(err => console.log(chalk.red(`Error found when azure-syncing: ${err}`)));
```

#### NOTE: `cache` option has a default value `public, max-age=31536000`, if you want to override it, you can specify a `cachall` like in the example below:

```js
const azure_conf = {
  ...,
  cache: [{
    match: "*",
    rule: "public, max-age=1234"
  }]
}
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
  account: "<your-azure-account>",
  accessKey: "<your-azure-access-key>",
  container: {
    name: "test",
    cache: [{
      match: ["path/to/your/file", "path/to/your/file2"],
      rule: "no-cache, no-store, must-revalidate"
    }, {
      match: "*",
      rule: "public, max-age=31536000"
    }],
    properties: {
      Cors: {
        CorsRules:  [{
          MaxAgeInSeconds: 15,
          AllowedOrigins: ["*"],
          AllowedMethods: ["GET", "PUT", "OPTIONS"],
          AllowedHeaders: ["origin", "x-ms-blob-type*", "Content-Type*"],
          ExposedHeaders: ["origin", "x-ms-blob-type*", "Content-Type*"]
        }]
      }
    },
    policy: {
      publicAccessLevel : "blob"
    }
  },
  progress: true, // defaults to false
  sources: [{
    dir: `${path.resolve('dist')}`,
    pattern: '/**/*',
    include: true //include folder or not (ex: dist/file.js)
  }, {
    dir: `${path.resolve('static')}`,
    pattern: '/**/*'
  }]
  verbose: true // if you want to see the current uploaded file
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
    cache: process.env.AZURE_SYNC_CONTAINER_CACHE,
    properties: process.env.AZURE_SYNC_CONTAINER_PROPERTIES,
    policy: process.env.AZURE_SYNC_CONTAINER_POLICY
  },
  progress: process.env.AZURE_SYNC_PROGRESS,
  sources: process.env.AZURE_SYNC_SOURCES,
  verbose: process.env.AZURE_SYNC_VERBOSE
};
```

## You can use the function and the CLI invocation methods with no problem, the parameters will be deep-merged having priority on the ones defined via CLI (you can pass `cache`, `properties`, etc calling it as a function, then define `account` & `accessKey` via CLI and it will work ok)

Cheers 🤖
