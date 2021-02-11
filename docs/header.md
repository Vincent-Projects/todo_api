## Introduction

This API is a TodoList that implement simple CRUD operation and an authentication system. As this API is a demo project, by default you cannot dirrectly create account, you first need to DM via my [github profile](https://github.com/Vincent-Projects) or via my [twitter profile](https://twitter.com/Crys_Dev) me in order to receive a code for creating an account to be able to test this API. This choice has been made to replicate as possible a real project, hosting, mailer service and database.

The [Authentication](#api-Authentication) part describe the enpoints for the authentication system ad login, signup and account verification.
The [Todos](#api-Todos) part will dive into the enpoints that is used for the todo app, which implements the CRUD operation.

### Status Code

#### 2xx

-   200 : Response OK
-   201 : Ressource has been created

#### 4xx

-   401 : Unauthorized to perform request

#### 5xx

-   500 : This status code represent a server error.

### Authentication & Security

When a user is logged in ( token sent back from login endpoint ), to use todos endpoint you must provide the authenticated token. Otherwise the API will return an error response.
The token system uses Bearer which means that the token sent by the API must be provided using Bearer.
This Rest API uses JSON format as request and response data.

Example of header:

```json
{
    "Content-Type": "application/json",
    "Authorization": "Bearer TOKEN_HERE"
}
```
