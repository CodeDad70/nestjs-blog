import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';

import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        /** Inject JWT Service */
        private readonly jwtService: JwtService,

        /** Inject JWT configuration service */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ){}

    public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
                sub: userId,
                ...payload
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: expiresIn
            }
        );
    }

    public async generateTokens(user: User){
        const [accessToken, refreshToken] = await Promise.all([
        // Generate access token 
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
                email: user.email
            }),
            // Generate refresh token
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.refreshTokenTtl)
        ]);
        return {
            accessToken, 
            refreshToken
        }
    }
}
