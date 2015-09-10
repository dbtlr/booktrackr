
import fs from 'fs';

const configFile = 'config.js';

let config = null;

export function read() {
  if (config) {
    return config;
  }

  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

  } catch (e) {}

  return config;
}

export function write() {
  fs.writeFile(configFile, JSON.stringify(config), function (err) {
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