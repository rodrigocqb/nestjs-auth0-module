import { DynamicModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
  static forRoot(config: { audience: string; issuer: string }): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        JwtStrategy,
        {
          provide: 'AUTH_CONFIG',
          useValue: config,
        },
      ],
      exports: [PassportModule],
    };
  }
}
