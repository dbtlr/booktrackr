# BookTrackr
---

> This application is based on the [React Redux Hot Loader Bootstrap](https://github.com/erikras/react-redux-universal-hot-example) project.

## Setting up the WordPress Host.

In order to get this application set up, it needs to have a WordPress host set as an API backend. to do this, you need to do a few things.

First, ensure the following plugins are loaded.

1. [WP-API v2](https://wordpress.org/plugins/rest-api/)
2. [OAuth](https://github.com/WP-API/OAuth1)
3. [Booktrackr Plugin](https://github.com/dbtlr/booktrackr-plugin)

You also need to follow the instructions to install the wp-cli on your wordpress host. This is needed in order to add an OAuth client key, which will be needed in order to connect.

[Follow those instructions here](http://wp-cli.org/).

Once this has been done, you need to generate your oauth tokens by running the `wp oauth1 add` command as detailed here: https://github.com/WP-API/client-cli#step-1-creating-a-consumer

Make sure you save the client key AND secret, as you'll need them later.

## Installation

```
npm install
```

## Run the Base Setup Script

This will configure either your local environment or the server it is on with how to connect to the base WordPress backend.

```
npm run setup
```

you will then be asked to provide the OAuth Client Key, OAuth Client Secret, and the url to the WordPress API.

## Running Dev Server

```
npm run dev
```

