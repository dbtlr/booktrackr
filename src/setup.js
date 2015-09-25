import cli from 'cli';
import prompt from 'prompt';
import * as wpConfig from './models/config';

let data = wpConfig.read() || {};

prompt.start();

const schema = {
  properties: {
    oauth_token: {
      message: 'Your OAuth Token Key',
      required: true,
      default: data.oauth_token || ''
    },
    oauth_token_secret: {
      message: 'Your OAuth Token Secret',
      required: true,
      default: data.oauth_token_secret || ''
    },
    wp_api: {
      message: 'WordPress API Host (ie: https://myblog.com/)',
      required: true,
      default: data.wp_api || ''
    }
  }
};

cli.main(function(args, options) {
  prompt.get(schema, function (err, result) {
    if (err) return console.error(err);

    wpConfig.set(result);
    wpConfig.write();
  });
});