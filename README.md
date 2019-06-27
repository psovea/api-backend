# OVerzicht API

This repository contains the code for requesting static and dynamic data regarding public transportation in the Netherlands.

## Development

### Checking out the branch and installing dependencies
Checking out the repository (make sure that nodejs is installed):

```bash
git clone git@github.com:psovea/api-backend.git
npm i
```

### Starting the API (endpoints for the front end) **DEPRECATED**

Running the API locally can be done by simply running the following command:

```bash
npm start
```

This will start a server that listens to port `3000`. An easy way to do requests is to install [postman](https://www.getpostman.com/downloads/).

### Starting the deamon for extracting static data

This repository includes a script that retrieves the current state of the public transport in the Netherlands. To retrieve this data and store it in our static database, run the following command:

```bash
> npm run static
```

### Starting the socket for live data

```bash
> npm run socket
```

You can now connect to the socket on port 3500.

## Contributing

### Coding Style
We use the [standardjs](https://standardjs.com) coding style. The easiest way to incorporate this into your workflow is to install a linter:

- Vim: https://github.com/w0rp/ale
- Atom: https://atom.io/packages/linter-js-standard
- Visual Studio: https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs

To check if it passes the test, you can run `npm test`

## Documentation

For some more information, please refer to the [wiki](https://github.com/psovea/api-backend/wiki)
