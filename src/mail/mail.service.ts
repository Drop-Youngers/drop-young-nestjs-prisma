import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { welcome } from './templates/welcome';
import { initiateEmailVerification } from './templates/initiate-email-verification';
import { initiatePasswordReset } from './templates/initiate-password-reset';
import { passwordResetSuccessful } from './templates/password-reset-successful';
import { emailVerified } from './templates/email-verified';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter
    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: this.configService.get('MAIL_SERVICE'),
            port: this.configService.get('MAIL_PORT'),
            secure: true,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }

    async sendWelcomeEmail({ names, email }: { email: string, names: string }) {
        const mailOptions: nodemailer.SendMailOptions = {
            to: email,
            subject: 'Welcome to AIC',
            html: welcome({ names })
        };
        console.log("[APPLICATION LOG]: Sending welcome email to " + email)
        await this.transporter.sendMail(mailOptions);
        console.log("[APPLICATION LOG]: Mail to " + email + ' sent')
    }

    async sendInitiateEmailVerificationEmail({ email, verificationCode, names }: { email: string, verificationCode: string, names: string }) {
        const mailOptions: nodemailer.SendMailOptions = {
            to: email,
            subject: 'Verify your email address',
            html: initiateEmailVerification({ names, verificationCode })
        };
        console.log("[APPLICATION LOG]: Sending email verification to " + email)
        await this.transporter.sendMail(mailOptions);
        console.log("[APPLICATION LOG]: Mail sent to " + email + " successfully")
    }

    async sendInitiatePasswordResetEmail({ email, token, names }: { email: string, token: string, names: string }) {
        const mailOptions: nodemailer.SendMailOptions = {
            to: email,
            subject: 'Reset your password',
            html: initiatePasswordReset({ token, names })
        };
        console.log("[APPLICATION LOG]: Sending password reset initialization to " + email)
        await this.transporter.sendMail(mailOptions);
        console.log("[APPLICATION LOG]: Mail sent to " + email + " successfully")
    }

    async sendPasswordResetSuccessfulEmail({ email, names }: { email: string, names: string }) {
        const mailOptions: nodemailer.SendMailOptions = {
            to: email,
            subject: 'Password reset successful',
            html: passwordResetSuccessful({ names })
        };
        console.log("[APPLICATION LOG]: Sending password successful to " + email)
        await this.transporter.sendMail(mailOptions);
        console.log("[APPLICATION LOG]: Mail sent to " + email + " successfully")
    }

    async sendEmailVerificationSuccessfulEmail({ email, names }: { email: string, names: string }) {
        const mailOptions: nodemailer.SendMailOptions = {
            to: email,
            subject: 'Password reset successful',
            html: emailVerified({ names })
        };
        console.log("[APPLICATION LOG]: Sending email verification successful to " + email)
        await this.transporter.sendMail(mailOptions);
        console.log("[APPLICATION LOG]: Mail sent to " + email + " successfully")
    }


}