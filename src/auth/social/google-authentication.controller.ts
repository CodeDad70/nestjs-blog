import { Controller, Post, Body } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
    constructor(
        /** Inject googleAuthenticationService */
        private readonly googleAuthenticationService: GoogleAuthenticationService
    ){} 

    @Post()
    @Auth(AuthType.None)
    public authenticate(@Body() googleTokenDto: GoogleTokenDto){
        return this.googleAuthenticationService.authenticate(googleTokenDto)
    }
}
