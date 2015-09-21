
import fs from 'fs-extra';

const configFile = 'data/config.json';

let config = null;

export function read() {
  if (config) {
    return config;
  }

  try {
    config = fs.readJsonSync(configFile);

  } catch (e) {}

  return config;
}

export function write() {
  fs.writeJson(configFile, config, function (err) {
    if (err) {
      console.log(err);
      return false;

    } else {
      console.log('Config file was written successfully.');
      return true;
    }
  });
}

export function set(newConfig) {
  config = newConfig;
}