# Overview

This package is a NestJS Auth Module to help facilitate integration with [Auth0](https://auth0.com). It includes some other features such as Guards for Auth and Permissions as well as an in-build @Permissions decorator to extract permissions/access scopes.

If you would like to see new stuff added to this package, feel free to reach out to me either via email (rodrigocortibarros@gmail.com) or by opening an issue on the [Github repository](https://github.com/rodrigocqb/nestjs-auth0-module)!

# Installation

Installation is pretty straightforward. Just install it using npm or your favourite package manager.

```bash
npm i nestjs-auth0-module
```

# Usage

I won't go into details on how to use Auth0 since their documentation is good enough as is. To use this package, you just need to get your audience (your created api) and issuer url (your tenant url) variables.

Your `.env` file should look something like this:

```shell
# Auth0 config
AUTH0_AUDIENCE=https://your-api.com
AUTH0_ISSUER_URL=https://your-tenant-url.us.auth0.com/
```

## AuthModule

You can import this on your `app.module.ts` file or on another module. You need to pass the audience and issuer url params to the `AuthModule` to configure it using the `forRoot` method. To use environment variables, you would need either the `@nestjs/config` or the `dotenv` packages as you can see in the example below:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'nestjs-auth0-module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_URL,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## JwtAuthGuard

The `AuthModule` by itself doesn't do any magic. We need this little fellow here together with the `@UseGuards` decorator that comes with the `@nestjs/common` package.

You can use it both above the controller to affect all methods or just on the specific route you need authentication.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from 'nestjs-auth0-module';

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

In case the user does not pass a valid Auth0 token using the Bearer token format, it will throw a 401 error.

## @Permissions and PermissionsGuard

In tandem with the `JwtAuthGuard`, we can also call our `PermissionsGuard` to validate the permissions/access scopes from the access token and see if they include the required permission(s) on the `@Permissions` decorator.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  JwtAuthGuard,
  Permissions,
  PermissionsGuard,
} from 'nestjs-auth0-module';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Permissions('read:all')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

In case the user does not have the required permission(s), it will throw a 403 error.

### Multiple permissions

Just add them to the decorator like the example below and the guard will validate them all.

```typescript
@Permissions('read:all', 'read:hello')
@Get()
getHello(): string {
return this.appService.getHello();
}
```

## JwtStrategy

In most cases, you won't need this. It is only exported because you might want to extend it for more specific cases that aren't currently covered by this package.
Feel free to reach out to me if you want to see more customization regarding this!

# Demo repository

If you want, you can check out my [demo repository](https://github.com/rodrigocqb/nestjs-auth0-module-example) so you can see the integration with the package by yourself. It has just the base NestJS dependencies and the nestjs-auth0-module package.

# License

This package is [MIT licensed](https://github.com/rodrigocqb/nestjs-auth0-module/blob/main/LICENSE)
