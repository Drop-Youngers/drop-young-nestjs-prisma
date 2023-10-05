import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private jwtService: JwtService,
    ) { }

    async create(dto: CreateUserDTO) {
        try {
            const hashedPassword = await hash(dto.password, 10)
            const user = await this.prisma.user.create({
                data: {
                    ...dto,
                    role: dto.role,
                    password: hashedPassword
                }
            })

            await this.mailService.sendWelcomeEmail({ names: user.names, email: user.email })
            const token = await this.jwtService.sign({ id: user.id })
            return { user, token }
        }
        catch (error) {
            if (error.code === 'P2002') {
                const key = error.meta.target[0]
                throw new HttpException(`${key.charAt(0).toUpperCase() + key.slice(1)} (${dto[key]}) already exists`, 400);
            }
            throw error
        }
    }

    async update(id: string, dto: UpdateUserDTO) {
        try {
            const _user = await this.prisma.user.findUnique({ where: { id } })
            if (_user.email !== dto.email) await this.prisma.user.update({
                where: { id },
                data: {
                    ...dto,
                    verificationStatus: 'UNVERIFIED',
                }
            })
            else await this.prisma.user.update({
                where: { id },
                data: {
                    ...dto
                }
            })
            const user = await this.prisma.user.findUnique({ where: { id } })
            return user;
        }
        catch (error) {
            if (error.code === 'P2002') {
                const key = error.meta.target[0]
                throw new HttpException(`${key.charAt(0).toUpperCase() + key.slice(1)} (${dto[key]}) already exists`, 400);
            }
            throw error
        }
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        return user
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })
        return user
    }

    async findByVerificationCode(code: string) {
        const user = await this.prisma.user.findFirst({ where: { verificationCode: code } })
        return user
    }

    async findByPasswordResetCode(code: string) {
        const user = await this.prisma.user.findFirst({ where: { passwordResetCode: code } })
        return user
    }

    async search(query: string) {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { names: { contains: query } },
                    { email: { contains: query } },
                    { telephone: { contains: query } },
                ]
            },
            take: 10,
            skip: 0,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                names: true,
                profile: true
            }
        })
        return users
    }

    async findAll(page: number, limit: number) {
        const users = await this.prisma.user.findMany({
            take: Number(limit),
            skip: page * limit,
            orderBy: {
                createdAt: 'desc'
            }
        })
        return users
    }

    async deleteUser(id: string) {
        const user = await this.prisma.user.delete({ where: { id } })
        return user
    }

    async updateAvatar(id: string, avatarUrl: string) {
        const user = await this.prisma.user.update({ where: { id }, data: { profile: avatarUrl } })
        return user
    }

}
