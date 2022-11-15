# PTTB Shopee Service V1

Service that handle the integration between Frontend/Backend and Shopee.

This service is based on [Awesome NestJS Boilerplate v8](README_NEST.md). Typescript is the main programming language and NestJS is the framework. This service depends on Shopee API to work. PostgreSQL is used as database. SQS is used for messaging service.

## Setup

1. Run `yarn` to install all dependencies.
2. Create new Postgres DB. Alternatively, use `docker-compose up` to create Postgres docker instance with the same configs. Or use existing Postgres DB.
3. Copy `.env.example` to `.env` and fill it with the correct Postgres and SQS configs.
4. Run `yarn migration:run` to do DB migrations.
5. Run `yarn start:dev` to build the app and run it locally.
6. Go to [Shopee Console Management](https://open.shopee.com/myconsole/management/app), retrieve the `partner_id` and use this to register new account/account on the this service. See [Authentication](#authentication) section.


## Docs

### HTTP API

API Reference can be accessed at [pttb-chat.stoplight.io](https://pttb-chat.stoplight.io/) or go to `/docs/swagger.json` and import that file to Postman/Swagger/any API Docs app to see it. This API docs may be not up to date if you develop new endpoint.

If you want the most up to date docs, go to [{{url}}/documentation](http://localhost:3000/documentation) after running the service.

### Authentication

There are 2 authentications concept for using this service. The first is authentication for other services that want to access this service API. The second one is OAuth mechanism to access Shopee API on behalf of the shop. The rest of OAuth mechanism will be handled by this service.

Only the initial OAuth login/registration that need to be triggered by client and `user_id` need to be provided by the client for each api call. `user_id` is internal PTTB `id` to identify the user so this service can translate that info for further integration with Shopee. 

![Authentication mechanism](/docs/auth.png "Authentication mechanism").


#### API Authentication

`X-API-Key` header is used for API authentication. Add this header and value equal to your API Key to the HTTP API request. This single API key can be used to access all functionality on this service regardless of an actual Shopee account.

Create the admin account and generate the API key via  `POST {{url}}/auth/register` to get this. You can create the first super admin account manually via DB by adding a row in `users` table.

Single account/API Key will correspond to single Partner/`partner_id` on the Shopee side.

#### Shopee OAuth

The Shopee Oauth is handled by this service. The only flow that client needed are:
1. Call `GET /shopee/auth/get_auth_url` and provide the `user_id` to retrieve the URL that the user need to be visited/redirected.
2. Let the end user login and authorize their Shopee account to our service. Note: For now, the client not get the notification whether it is successful or not.
3. Call other API and provide the same `user_id`. Now you can access our user Shopee data. If you get `401` error, check the error message. If the problem is related to Shopee Oauth, do step 1 again and let the user reauthenticate. This may happens if user fails to do the OAuth or we never accessing the user acount more than 30 days. To prevent the later problem, for now, you can schedule any API call to this service for that user so it never expires.


### Client Guide

#### HTTP API

To request the API, you can use any library with HTTP functionality like Axios, jQuert, or built-in fetch/Request in Javascript.

This is example to send a message and receive the ack.
```javascript
    data = {
        status: "ACCEPTED",
        message,
    };

    const options = {
        method: "POST",
        headers: {
            "X-API-Key": apiKey,
        },
        body: JSON.stringify(data),
    };

    fetch(url, options)
        .then((response) => response.json())
        .then((message) => {
            console.log(message);
  });
```
## Quality Assurance

### Unit Test

Not available.

### E2E Test

TODO

## Deployment

TODO

## Monitoring

Not available.

## Best Practices

1. Use `yarn lint:fix` and make sure all passes.
2. Look around the existing codebase about how to structure the code. It is better to be consistent and understood by future you/your team rather than try the "better" way that hard to understand.
3. Run the automated test, never break it. Add more test if you add new feature. Add more test if you encounter bugs that is not covered by existing test.
4. Try to automate everything.