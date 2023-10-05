import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateAvatarDTO } from './dto/update-avatar.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Post("create")
    async create(@Body() dto: CreateUserDTO) {
        const response = await this.userService.create(dto);
        return ServerResponse.success("User created successfully", { ...response })
    }

    @Put("update")
    @UseGuards(AuthGuard)
    async update(@Req() req: AuthRequest, dto: UpdateUserDTO) {
        const user = await this.userService.update(req.user.id, dto);
        return ServerResponse.success("User updated successfully", { user })
    }

    @Get("me")
    @UseGuards(AuthGuard)
    async me(@Req() req: AuthRequest) {
        const user = await this.userService.findById(req.user.id);
        return ServerResponse.success("User fetched successfully", { user })
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiParam({ name: "id", required: true })
    async findById(@Param("id") id: string) {
        const user = await this.userService.findById(id);
        return ServerResponse.success("User fetched successfully", { user })
    }

    @Get("search/:query")
    @UseGuards(AdminGuard)
    @ApiParam({ name: "query", required: true })
    async search(@Param("query") query: string) {
        const users = await this.userService.search(query);
        return ServerResponse.success("Users fetched successfully", { users })
    }

    @Get("all")
    // @UseGuards(AdminGuard)
    @ApiQuery({ name: "page", required: false, example: 0 })
    @ApiQuery({ name: "limit", required: false, example: 5 })
    async all(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 5,
    ) {
        const users = await this.userService.findAll(page, limit);
        return ServerResponse.success("Users fetched successfully", { users })
    }

    @Delete("")
    @UseGuards(AuthGuard)
    async deleteMyAccount(@Req() req: AuthRequest) {
        await this.userService.deleteUser(req.user.id);
        return ServerResponse.success("User deleted successfully")
    }

    @Delete(":id")
    @UseGuards(AdminGuard)
    async deleteAccount(@Param("id") id: string) {
        await this.userService.deleteUser(id);
        return ServerResponse.success("User deleted successfully")
    }

    @Patch("/update-avatar")
    @UseGuards(AuthGuard)
    async updateAvatar(@Req() req: AuthRequest, @Body() dto: UpdateAvatarDTO) {
        const user = await this.userService.updateAvatar(req.user.id, dto.avatarUrl);
        return ServerResponse.success("Avatar updated successfully", { user })
    }
}
