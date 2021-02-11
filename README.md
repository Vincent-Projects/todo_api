# TodoList

This is an API for a simple TodoList app that is for learning purpose. It implements CRUD operations and a complete authentication system. Feel free to install it on your local machine and try it.

## Documentation

The documentation will be soon available at [this link](http://http://138.68.119.174/docs). You can see the full code of documentation in `/docs` folder.

I used [apiDoc](https://apidocjs.com/) to create the documentation. You can run `npm run docs` to generate a documentation at `/docs/src`. To understand how it works see the apiDocs documentation.

## Contribute

To contribute to this API follow the instruction bellow. Since the main purpose of this project is to learning, your changes may take some times to be merge with the code or may end up not merged at all.

### Installation

The installation process assume you have an account on [MongoDB atlas](https://account.mongodb.com/account/login) and that you have a cluster that is available. It assume that you have an account on [Mailtrap](https://mailtrap.io/signin) to capture email during your tests. And of course it assume that you have [Nodejs](https://nodejs.org/en/) installed with npm available ( it comes with Nodejs installation ) and [Git](https://git-scm.com/) to clone the repo from github.

To check the version of Nodejs and npm

`node -v`
`npm --version`

First you need to fork this repo to your repositories.
Then run the following commands to clone the project to your machine.

`git clone https://github.com/YOUR_USERNAME/todo_api`

### Configuration

Once you have the project on your machine your need to configure it.

Create the environements variables, first create a config folder, then copy the sample.env file into it and rename it config.env.

`mkdir config`
`cp sample.env config/config.env`

Then make some change into config/config.env
Change all fields that are uppercase with your database and mailtrap informations.

Finally install all dependancies.

`npm install`

### Commands

To run
`npm run dev`

To test
`npm run test`
