import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AUTH_HEADER_KEY, DOCS_AUTH_STRATEGY } from './constants';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('PTTB Shopee Service V1')
    .setDescription(
      `## Shopee API
        All endpoints under \`/shopee/\` will point to Shopee API with similar request/response format.
         See (Shopee API Reference)[https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1] for more details.
         The difference is client doesn't need to handle \`partner_id, access_token, shop_id, sign, and timestamp\`.
         Only \`user_id\` that parameter need to be provided.

      ## Authentication
      1. All API endpoint is behind \`X-API-KEY\` authentication in headers.
      2. Go to \`/shopee/auth/get_auth_url\` and let the user authorize their Shopee account.
      3. Go to any endpoints in this API with that same \`user_id\`. The Shopee Auth will be handled.

      ### REST

    Routes is following Shopee Style API`,
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: AUTH_HEADER_KEY,
        in: 'header',
      },
      DOCS_AUTH_STRATEGY,
    );

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`,
  );
}
