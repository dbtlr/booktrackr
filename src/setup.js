import cli from 'cli';
import prompt from 'prompt';
import * as wpConfig from './utils/wp-config';
import * as wpapi from './api/wpapi';

let data = wpConfig.read();

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
    wp_api_host: {
      message: 'Host for the wordpress api',
      required: true,
      default: data.wp_api_host || ''
    },
    wp_api_port: {
      message: 'Port for the wordpress api',
      default: data.wp_api_port || 80
    },
    wp_api_protocol: {
      message: 'Protocol for the wordpress api',
      default: data.wp_api_protocol || 'http'
    },
    wp_api_prefix: {
      message: 'Path prefix for the wordpress api',
      default: data.wp_api_prefix || ''
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