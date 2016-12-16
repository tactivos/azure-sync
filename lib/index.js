#!/usr/bin/env node
import config from './config';
import async from 'async';
import azure from 'azure-storage';
import crypto from 'crypto';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import chalk from 'chalk';
import Progress from 'progress';

(() => {

  if (!module.parent) {
    return sync(config());
  }

  module.exports = (params) => sync(config(params));

})();

function sync(cfg) {

  return new Promise((resolve, reject) => {

    const filter = new azure.LinearRetryPolicyFilter({ retryCount: 5, retryInterval: 5000 });

    const uri = `DefaultEndpointsProtocol=https;AccountName=${cfg.account};AccountKey=${cfg.accessKey}`;
    const service = azure.createBlobService(uri).withFilter(filter);

    const defaultCache = 'public, max-age=31536000';
    const cache = cfg.container.cache || [];
    const cacheAll = cache.find(o => o.match === '*') || {};

    service.createContainerIfNotExists(cfg.container.name, cfg.container.policy, (err, result) => {
      if (err) return reject(`Error creating container: ${err}`);

      setServiceProperties(service, cfg.service, err => {
        if (err) return reject(`Error setting service properties: ${err}`);

        const sources = cfg.sources.reduce((initial, source) => initial.concat({ dir: source.dir, paths: glob.sync(source.dir + source.pattern), include: !!source.include }), []);
        const total = sources.reduce((initial, source) => initial + source.paths.length, 0);

        const progressBar = new Progress('[:bar] (:current/:total) :percent | Elapsed :elapseds - ETA :etas', { total, width: 50 });
        const tickAndContinue = cb => { if (cfg.progress) progressBar.tick(); cb(); };

        async.each(sources, (source, nextSource) => {

          async.each(source.paths, (file, nextFile) => {

            if (fs.lstatSync(file).isDirectory()) return tickAndContinue(nextFile);

            const replacement = !(source.include) ? source.dir : path.resolve();
            const blobName =  file.replace(`${replacement}${path.sep}`, '');

            service.getBlobProperties(cfg.container.name, blobName, (err, blob) => {
              if (err && err.statusCode !== 404) return nextFile(err);

              const content = fs.readFileSync(file);
              const hash = crypto.createHash('md5').update(content).digest('base64');

              if (!err && hash ===  blob.contentSettings.contentMD5) {
                return tickAndContinue(nextFile);
              }

              const cacheRule = cache.find(o => Array.isArray(o.match) ? o.match.find(m => file.indexOf(m) !== -1) : file.indexOf(o.match) !== -1) || {};

              const params = {
                contentSettings: {
                  cacheControl: cacheRule.rule || cacheAll.rule || defaultCache
                }
              };

              service.createBlockBlobFromLocalFile(cfg.container.name, blobName, file, params, (err) => {
                if (err) {
                  console.log(chalk.red(`\n uploading ${file}`));
                  return nextFile(err);
                }

                if (cfg.verbose) console.log(chalk.yellow(`\n Uploaded: ${file}`));

                return tickAndContinue(nextFile);
              });
            });
          }, nextSource);

        }, err => {

          if (err) return reject(`Unexpected error: ${err}`);

          console.log(chalk.green(`Completed Azure Storage Sync`));

          resolve();

        });
      });
    });
  });
}

function setServiceProperties(azure, service, cb) {

  if (!service || !Object.keys(service).length || !service.overwrite) {
    return cb();
  }

  azure.setServiceProperties(service.properties, err => cb(err));
}
