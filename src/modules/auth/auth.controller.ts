import { Body, Controller, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import ServerResponse from 'src/utils/ServerResponse';
import { AuthRequest } from 'src/types';

@Controller('auth')
@ApiTags("auth")
@ApiBearerAuth()
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("login")
    async login(@Body() dto: LoginDTO) {
        const response = this.authService.login(dto);
        return response;
    }

    @Patch("initiate-reset-password")
    async initiateResetPassword(@Body() dto: InitiateResetPasswordDTO) {
        await this.authService.initiateResetPassword(dto);
        return ServerResponse.success(`Password reset link has been sent to ${dto.email}`);
    }

    @Patch("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDTO) {
        await this.authService.resetPassword(dto);
        return ServerResponse.success("Password reset successfully");
    }

    @Patch("initiate-email-verification")
    async initiateEmailVerification(@Req() req: AuthRequest) {
        await this.authService.initiateEmailVerification(req.user.id);
        return ServerResponse.success(`Verification code has been sent to your email`);
    }

    @Patch("verify-email/:code")
    async verifyEmail(@Param("code") code: string) {
        await this.authService.verifyEmail(code);
        return ServerResponse.success("Email verified successfully");
    }
}
