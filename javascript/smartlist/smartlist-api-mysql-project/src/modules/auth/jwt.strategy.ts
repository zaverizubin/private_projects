import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from './dto/request/jwt.payload';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(
        process.cwd() + configService.get('JWT_PRIVATE_KEY'),
        'utf8',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    await this.authService.validateAccessToken(payload);
    const jwtPayload: JWTPayload = new JWTPayload(
      payload.sub,
      payload.email,
      payload.role,
    );

    return jwtPayload;
  }
}
