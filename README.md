
# barbershop-appointment-reservation-backend
This is a REST API built with [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), [Passport](http://www.passportjs.org/docs/).

REST API deployed to Heroku 


## Description
This REST API allows a visitor to book a haircut appointment at a barbershop. 

I take the following into account:
- the barbershop is open 9 AM - 6PM on business days
- break time is from 1 PM - 2PM
- barbershop is closed on weekends
- each appointment is 50 minutes long
- appointments only start at HH:00:00 and end at HH:50:00
- no 2 individuals can book an appointment for the same time

## Install
### `npm install`
Runs the app in the development mode.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The server will automatically restart if you make edits.

## Run the app locally
### `npm run dev`
Runs the app in the development mode.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The server will automatically restart if you make edits.

## Usage
Add a .env file at the root of the project directory with the following contents:
 - MONGODB_URI 
 - ACCESS_TOKEN_SECRET
 - SESSION_SECRET


## API endpoints
### RESERVATIONS

 - `GET /reservations` - get all reservations (default: get today's reservations) -  can only be accessed by authorized users
 - `GET /reservations/:id` - gets a reservation with unique ID
 - `POST /reservation` - adds a new reservation
 - There are 7 *optional* query parameters

| Query parameter  	|  Description 	|   Type	|
|---	|---	|---	|
| `firstname`  	| First name 	| String 	|
| `lastname`  	| Last name	| String 	|
| `email`  	|  Email address 	| String 	|
| `date`  	|   Appointment date (eg: "2021-06-07")	| String 	|
| `limit`  	|  Number of reservations to return 	| Integer  	|
| `page`  	|  Offset the list of returned reservations by this amount * `limit` 	| Integer  	|
| `sort`  	|  Sorts returned reservations in ascending ('asc') or descending ('desc') order 	| String  	|


### USERS

 - `GET /users` - get all users
 - `POST /users/signup` - creates a new user
 - `POST /users/login` - sign in 
 - `GET /users/logout` - sign out

## Sample response
The following is a sample response from  `GET reservations?date=2021-06-07` :
```
[
  {
    "_id": "60a521218f1708b6d63fae9f",
    "firstName": "Lauretta",
    "lastName": "Ancell",
    "email": "lancell0@prweb.com",
    "startTime": "2021-06-07T13:00:00.000Z",
    "dateAdded": "2021-05-19T14:30:57.509Z",
    "endTime": "2021-06-07T13:50:00.000Z",
    "__v": 0
  },
  {
    "_id": "60a521478f1708b6d63faea0",
    "firstName": "Rodge",
    "lastName": "Bootell",
    "email": "rbootell1@booking.com",
    "startTime": "2021-06-07T14:00:00.000Z",
    "dateAdded": "2021-05-19T14:31:35.637Z",
    "endTime": "2021-06-07T14:50:00.000Z",
    "__v": 0
  },
  {
    "_id": "60a521548f1708b6d63faea1",
    "firstName": "Clarance",
    "lastName": "Heathcote",
    "email": "cheathcote2@usnews.com",
    "startTime": "2021-06-07T15:00:00.000Z",
    "dateAdded": "2021-05-19T14:31:48.766Z",
    "endTime": "2021-06-07T15:50:00.000Z",
    "__v": 0
  },
  {
    "_id": "60a521608f1708b6d63faea2",
    "firstName": "Latrena",
    "lastName": "Van Arsdall",
    "email": "lvanarsdall3@eepurl.com",
    "startTime": "2021-06-07T16:00:00.000Z",
    "dateAdded": "2021-05-19T14:32:00.664Z",
    "endTime": "2021-06-07T16:50:00.000Z",
    "__v": 0
  },
  {
    "_id": "60a521768f1708b6d63faea4",
    "firstName": "Edlin",
    "lastName": "Fife",
    "email": "efife4@epa.gov",
    "startTime": "2021-06-07T18:00:00.000Z",
    "dateAdded": "2021-05-19T14:32:22.506Z",
    "endTime": "2021-06-07T18:50:00.000Z",
    "__v": 0
  }
]
```
