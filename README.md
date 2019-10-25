# CourseList Backend API

A full-featured backend server for querying and updating infomation about the coding bootcamps in the marketplace.

The API documentation is uploaded on [Postman](https://documenter.getpostman.com/view/9185103/SVzxXyqr?version=latest).

The API is now deployed on [DigitalOcean](http://167.71.126.16/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. 

### Prerequisites

You need node.js and npm. Please confirm they are installed on your computer.

```
$ node -v
v10.16.3

$ npm -v
6.12.0
```

### Installing

First, we need to grab a copy of the project from the GitHub repo.

```
git clone https://github.com/peterhychan/node_list_backend
```

Change directory and install the dependencies by using the command: 

```
cd node_list_backend && npm i
```
Then, start the server by the command: 

```
npm start
```

Keep the terminal running, and the server is now available on `localhost:5000`. 

You may test the server by opening a new terminal with the following command:

```
$ curl localhost:5000/api/v1/bootcamps 
```
You will get a JSON response similar with the following :
 
```
{"success":true, .....}
```

## Deployment

The server will be deployed on [DigitalOcean](). 

## Built With

* [Node.js](https://nodejs.org) - the JavaScript runtime
* [Express.js](https://expressjs.com) - the Node.js Web Framework
* [MongoDB](www.mongodb.com/Atlas‎) - NoSQL Database
* [Postman](https://www.getpostman.com) - the tool for API testing

## Note
- You may want to rename "config/config.env.env" to "config/config.env", and updates the values inside for your own interest.

## Authors

* [**Ho Yeung (Peter) Chan**](https://peterhychan.github.io/)

