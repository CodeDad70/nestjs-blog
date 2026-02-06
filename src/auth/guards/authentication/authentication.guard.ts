import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.contants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  
  private static readonly defaultAuthType = AuthType.Bearer;

  // 1. Declare the property type here (NOT in the constructor params)
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    // 2. Initialize the value inside the constructor body
    // This allows you to safely use 'this.accessTokenGuard'
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // auth types from reflector 
    const authTypes = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    ) ?? [AuthenticationGuard.defaultAuthType]

    // create array of guards
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat()

    // default error 
    const error = new UnauthorizedException();
    
    // Loop guards - check canActivate 
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch((error) => {
        error
      }) 
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}