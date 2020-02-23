# Serverless TODO

3rd Assignment from [Udacity Cloud Developer ND](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items.
Each TODO item can optionally have an attachment image.
Each user only has access to TODO items that he/she has created.

The application stores TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item

You might also store an id of a user who created a TODO item.

# Features

- Auth0 is used for authentication
- All functions are already connected to appropriate events from API Gateway.
- Each user can only see his todos
- CRUD for TODOs is implemented
- For every TODO there can be a file attacted and stored on S3
An id of a user can be extracted from a JWT token passed by a client.
- Winston Logger is used for logging
- Serverless.yaml scaffolds everything on AWS

# How to run the application
## Backend

To deploy an application run the following commands.
Make sure that the link for the cert in the `auth0.hanlder` is set correctly

```
cd backend
npm install
sls deploy -v
```

## Frontend
-> provided by Udacity
To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.