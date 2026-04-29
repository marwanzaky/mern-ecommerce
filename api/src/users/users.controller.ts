import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { Public } from "@/auth/auth.guard";
import { Roles } from "@/decorators/roles.decorator";
import { CloudinaryService } from "@/modules/cloudinary/cloudinary.service";
import { ProductsService } from "@/products/products.service";
import { IRequest } from "@/types/request.type";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiBearerAuth("Authorization")
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly productsService: ProductsService,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	@Get("/me")
	@ApiOperation({
		summary: "Get the authenticated user's info",
	})
	async getMe(@Req() request: IRequest) {
		return this.usersService.findUser(request.user.id);
	}

	@Get("/me/products")
	@ApiOperation({
		summary: "Get all products of the authenticated user",
	})
	async getMeProducts(@Req() request: IRequest) {
		return this.productsService.find({
			query: { user: request.user.id },
		});
	}

	@Patch("/updateMe")
	@ApiOperation({
		summary: "Update the authenticated user's info",
	})
	@UseInterceptors(FileInterceptor("photoFile"))
	async updateMe(
		@Req() request: IRequest,
		@Body() updateUserDto: UpdateUserDto,
		@UploadedFile() photoFile?: Express.Multer.File,
	) {
		let photoUrl: string | undefined;

		if (updateUserDto.photoUrl === "") {
			photoUrl = "";
		}

		if (photoFile) {
			photoUrl = await this.cloudinaryService.uploadFile(photoFile);
		}

		return this.usersService.updateUser(request.user.id, {
			name: updateUserDto.name,
			email: updateUserDto.email,
			photoUrl,
		});
	}

	@Delete("/deleteMe")
	@ApiOperation({
		summary: "Delete the authenticated user's account",
	})
	async removeMe(@Req() request: IRequest) {
		return this.usersService.removeUser(request.user.id);
	}

	@Patch("/updateMyPassword")
	@ApiOperation({
		summary: "Update the authenticated user's password",
	})
	async updateMyPassword(
		@Req() request: IRequest,
		@Body() updateUserPasswordDto: UpdateUserPasswordDto,
	) {
		return this.usersService.updateUserPassword(
			request.user.id,
			updateUserPasswordDto,
		);
	}

	@Get("public/:id")
	@Public()
	@ApiOperation({
		summary: "Get a specific public user",
	})
	async getPublicUser(@Param("id") id: string) {
		return this.usersService.findPublicById(id);
	}

	@Get()
	@Roles("admin")
	@ApiOperation({
		summary: "Get all users (admin-only)",
	})
	async getAllUsers() {
		return this.usersService.findAllUsers();
	}

	@Post()
	@Roles("admin")
	@ApiOperation({
		summary: "Create a new user (admin-only)",
	})
	async createUsers(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Get a specific user (admin-only)",
	})
	async getUser(@Param("id") id: string) {
		return this.usersService.findUser(id);
	}

	@Patch(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Update a specific user (admin-only)",
	})
	async updateUser(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@Delete(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Remove a specific user (admin-only)",
	})
	async removeUser(@Param("id") id: string) {
		return this.usersService.removeUser(id);
	}
}
