# PTTB Shopee Service V1

Service that handle the integration between Frontend/Backend and Shopee.

This service is based on [Awesome NestJS Boilerplate v8](README_NEST.md). Typescript is the main programming language and [NestJS](https://github.com/nestjs/nest) is the framework. This service depends on [Shopee API](https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) to work. PostgreSQL is used as database. Redis is used for queueing/messaging purpose, implemented using (Bull)[https://github.com/OptimalBits/bull] that does integrate with Nest.

## Setup

1. Run `yarn` to install all dependencies.
2. Create new Postgres DB. Alternatively, use `docker-compose up` to create Postgres docker instance with the same configs. Or use existing Postgres DB.
3. Copy `.env.example` to `.env` and fill it with the correct Postgres and SQS configs.
4. Run `yarn migration:run` to do DB migrations.
5. Run `yarn start:dev` to build the app and run it locally.
6. Go to [Shopee Console Management](https://open.shopee.com/myconsole/management/app), retrieve the `partner_id` and use this to register new account/account on the this service. See [Authentication](#authentication) section.


## Docs

### Design Docs

See the [Google Docs](https://docs.google.com/document/d/1sr6SIa7CNM-e3JzRncOtg37FBLvATbuk_2XQQ9JuiNw/edit?usp=sharing)

### HTTP API

API Reference can be accessed at [pttb-chat.stoplight.io](https://pttb-chat.stoplight.io/) or go to `/docs/swagger.json` and import that file to Postman/Swagger/any API Docs app to see it. This API docs may be not up to date if you develop new endpoint.

If you want the most up to date docs, go to [{{url}}/documentation](http://localhost:3000/documentation) after running the service.

### Authentication

There are 2 authentications concept for using this service. The first is authentication for other services that want to access this service API. The second one is OAuth mechanism to access Shopee API on behalf of the shop. The rest of OAuth mechanism will be handled by this service.

Only the initial OAuth login/registration that need to be triggered by client and `user_id` need to be provided by the client for each api call. `user_id` is `id` to identify the user so this service can translate that info for further integration with Shopee. This `id` can be our internal id or the same as Shopee `shop_id` that can be retrieved from their [Shop URL](https://seller.shopee.ph/edu/article/6524). Using `shop_id` is better for technical purposes but it is better UX for end user if they don't need to provide us with this technical information. For this, all API calls also have *optional* `shop_id` parameter to help identify the user more.

![Authentication mechanism](/docs/auth.png "Authentication mechanism").

All this authentication mechanism is based on the assumption that **1 User = 1 Shopee Shop**. Shopee have a feature called Subaccount that allow 1 User to have 1 Main Account and multiple Members Account including multiple Shop. This feature is not fully supported by this service for now. 


#### API Authentication

`X-API-Key` header is used for API authentication. Add this header and value equal to your API Key to the HTTP API request. This single API key can be used to access all functionality on this service regardless of an actual Shopee account.

Create the admin account and generate the API key via  `POST {{url}}/auth/register` to get this. You can create the first super admin account manually via DB by adding a row in `users` table. User environment will affect the Shopee API that will be used (Live, Sandbox, or Test/Mock server that was set in .env)

Single account/API Key will correspond to single Partner/`partner_id` on the Shopee side.

#### Shopee OAuth

The Shopee Oauth is handled by this service. The only flow that client needed are:
1. Call `GET /shopee/auth/get_auth_url` and provide the `user_id` or optional `shop_id` to retrieve the URL that the user need to be visited/redirected.
2. Let the end user login and authorize their Shopee account to our service. Note: For now, the client not get the notification whether it is successful or not.
3. Call other API and provide the same `user_id`. Now you can access our user Shopee data. If you get `401` error, check the error message. If the problem is related to Shopee Oauth, do step 1 again and let the user reauthenticate. This may happens if user fails to do the OAuth or we never accessing the user acount more than 30 days. To prevent the later problem, for now, you can schedule any API call to this service for that user so it never expires.

### Proxy

This service also provide simple proxy to Shopee API with the Oauth already handled. See the docs for `/proxy/*` endpoint to be more details.

Any request to that endpoint will be proxied to Shopee API with all parametes, payload, and authentication but no validation, db recording, or queue mechanism. Calling `{serviceUrl}/proxy/order/get_order_list?...` is the proxy version of `{serviceUrl}/shopee/order/get_order_list?...` which in turn will call equivalent Shopee API at `{ShopeeUrl}/api/v2/order/get_order_list?...`.


### DB 
On some `GET` API, getting either the list of resources or the resource detail will save the copy of the data on DB. There is no API to get this copy of the data and must be accessed directly to DB.

### Queue
On some `POST` API, if the `is_async` parameter is set to `true`, the request will be put on the queue instead of calling Shopee API directly. The queue is implemented using [Bull](https://github.com/OptimalBits/bull) and Redis as the messaging storage. If the task is failed, the queue will be automatically retried using exponential backoff. The last attempt will be around ~12 hours after the task is created.

To monitor the queue and retry it manually, go to the [{{url}}/admin/queues](http://localhost:3000/admin/queues) dashboard with the username and password according to `.env` config.

### Client Guide

#### HTTP API

To request the API, you can use any library with HTTP functionality like Axios, jQuert, or built-in fetch/Request in Javascript.

This is example to send a message and receive the ack.
```javascript
    data = {
        status: "ACCEPTED",
        order,
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

1. Copy `UAT_1.postman_environment.json.example` to `UAT_1.postman_environment.json` and fill the details. Alternatively, open it with Postman to make it easier.
2. Run `yarn run test:api`. Or use Postman app to edit the test or run it in visual environment.



## Deployment

TODO

## Monitoring

Not available.

## Best Practices

1. Use `yarn lint:fix` and make sure all passes.
2. Look around the existing codebase about how to structure the code. It is better to be consistent and understood by future you/your team rather than try the "better" way that hard to understand.
3. Run the automated test, never break it. Add more test if you add new feature. Add more test if you encounter bugs that is not covered by existing test.
4. Try to automate everything.