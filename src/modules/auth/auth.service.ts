import { HttpException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { UserService } from './../user/user.service';
import { LoginDTO } from './dto/login.dto';
import ServerResponse from 'src/utils/ServerResponse';
import { compareSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InitiateResetPasswordDTO } from './dto/initiate-reset-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private mailService: MailService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async login(dto: LoginDTO) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user) throw new HttpException("Invalid email or password", 400)
        const match = compareSync(dto.password, user.password)
        if (!match)  throw new HttpException("Invalid email or password", 400)
        const token = this.jwtService.sign({ id: user.id })
        return ServerResponse.success("Login successful", { token, user })
    }


    async initiateResetPassword(dto: InitiateResetPasswordDTO) {
        try {
            const user = await this.userService.findByEmail(dto.email);
            if (!user) ServerResponse.error("Invalid email address");
            if (user.passwordResetStatus === "PENDING") ServerResponse.error("Password Reset code already sent");
            const passwordResetCode = Math.floor(100000 + Math.random() * 900000).toString();
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    passwordResetCode,
                    passwordResetExpires: new Date(Date.now() + 600000),
                    passwordResetStatus: "PENDING"
                }
            })

            await this.mailService.sendInitiatePasswordResetEmail({ names: user.names, email: user.email, token: passwordResetCode })
            return user.email
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async resetPassword(dto: ResetPasswordDTO) {
        try {
            const user = await this.userService.findByPasswordResetCode(dto.code);
            if (!user) return ServerResponse.error("Invalid code");
            if (user.passwordResetExpires < new Date()) ServerResponse.error("Password reset code expired");
            const hashedPassword = await hash(dto.password, 10);
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword,
                    passwordResetCode: null,
                    passwordResetExpires: null,
                    passwordResetStatus: "IDLE"
                }
            })

            await this.mailService.sendPasswordResetSuccessfulEmail({ names: user.names, email: user.email })
            return true
        } catch (error) {
            throw error;
        }
    }

    async initiateEmailVerification(id: string) {
        try {
            const user = await this.userService.findByEmail(id);
            if (user.verificationStatus === "PENDING") ServerResponse.error("Verification code already sent");
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
            await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    verificationCode,
                    verificationExpires: new Date(Date.now() + 600000),
                    verificationStatus: "PENDING"
                }
            })

            await this.mailService.sendInitiateEmailVerificationEmail({ names: user.names, email: user.email, verificationCode })
            return user.email
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async verifyEmail(code: string) {
        try {
            const user = await this.userService.findByVerificationCode(code);
            if (!user) return ServerResponse.error("Invalid code");
            if (user.verificationExpires < new Date()) ServerResponse.error("Verification code expired");

            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    verificationStatus: "VERIFIED",
                    verificationCode: null,
                    verificationExpires: null
                }
            })
            await this.mailService.sendEmailVerificationSuccessfulEmail({ names: user.names, email: user.email })
            return true;
        } catch (error) {
            throw error;
        }
    }

}
