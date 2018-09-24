# dummy-banking [![CircleCI](https://circleci.com/gh/therealedsheenan/dummy-banking/tree/master.svg?style=svg)](https://circleci.com/gh/therealedsheenan/dummy-banking/tree/master)
A dummy api for basic banking

### Installation

##### With Docker
Make sure you install docker in your local machine.
Checkout docker website for more information.
https://docs.docker.com/install/

By simply running this command, it will install all the dependencies under the hood
and get you up and running in development environment.

```
$ docker-compose up
```

##### Without docker
```
$ yarn install # installing dependencies
$ yarn build # build typescript
$ yarn watch-debug # watch mode node and typescript
```

Checkout `npm scripts` for other commands.

### Testing

```
$ yarn test # run testing suite
```
