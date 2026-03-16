
import 'dotenv/config';
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Determine frontend origins
  const frontendOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:5173"]; // default frontend

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin or null origin
      // This covers: mobile apps (React Native APK), Postman, file:// WebViews
      // Note: Android WebViews and some RN configurations send the string "null" as origin
      if (!origin || origin === 'null') return callback(null, true);

      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In production, check against allowed origins
      if (frontendOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Use null (not an Error) so the request still completes.
        // Browsers will be blocked by CORS (no ACAO header = browser blocks the read).
        // Native mobile clients (React Native/Expo) don't enforce CORS so they
        // will receive the response regardless — which is the desired behaviour.
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Enable class-transformer
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Server listening on ${port}`);
}

bootstrap();
