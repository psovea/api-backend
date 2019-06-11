# PSOVEA API

This repository contains the code for requesting static and dynamic data regarding public transportation in the Netherlands.

## Development

### Checking out the branch and installing dependencies
Checking out the repository (make sure that nodejs is installed):

```bash
git clone git@github.com:psovea/api-backend.git
npm i
```

### Starting the API (endpoints for the front end)

Running the API locally can be done by simply running the following command:

```bash
npm start-server
```

This will start a server that listens to port `3000`. An easy way to do requests is to install [postman](https://www.getpostman.com/downloads/).

### Starting the deamon for extracting static data

We use `node-cron` for our deamon, as we want to run a script that inserts data into our database every hour. To start it, simply run `npm start-static-daemon`. This will start the cron job.

## Contributing

### Coding Style
We use the [standardjs](https://standardjs.com) coding style. The easiest way to incorporate this into your workflow is to install a linter:

- Vim: https://github.com/w0rp/ale
- Atom: https://atom.io/packages/linter-js-standard
- Visual Studio: https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs

To check if it passes the test, you can run `npm test`

### Unit testing

After adding a feature, it is required to add a unit test in `endpoints/test`, to make sure that it performs as expected.

TODO, more about this later
