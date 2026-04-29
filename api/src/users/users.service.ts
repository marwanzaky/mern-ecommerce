import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { compare } from "bcrypt";
import { Model } from "mongoose";

import { AuthService } from "@/auth/auth.service";
import {
	CreateUser,
	UpdateUser,
	UpdateUserPassword,
} from "@/shared/types/user.type";

import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		@Inject(forwardRef(() => AuthService)) private authService: AuthService,
	) {}

	async updateUserPassword(
		id: string,
		updateUserPassword: UpdateUserPassword,
	): Promise<{ token: string } | null> {
		const { currentPassword, newPassword } = updateUserPassword;

		const user = await this.userModel.findById(id).select("+password");

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		const passwordMatch = await compare(currentPassword, user.password);

		if (passwordMatch === false) {
			throw new UnauthorizedException("Incorrect current password");
		}

		user.password = newPassword;

		await user.save();

		return {
			token: await this.authService.createAccessToken(user.id, user.role),
		};
	}

	async create({ name, email, password }: CreateUser): Promise<User> {
		try {
			const user = await this.userModel.create({
				name,
				email,
				password,
			});

			return user.save();
		} catch (error: any) {
			if (error.code === 11000) {
				throw new ConflictException("Email already exists");
			}

			throw error;
		}
	}

	async findAllUsers(): Promise<User[]> {
		return this.userModel.find();
	}

	async findUser(id: string): Promise<User> {
		const user = await this.userModel.findById(id);

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	async findPublicById(id: string): Promise<User> {
		const user = await this.userModel
			.findById(id)
			.select("_id name photoUrl")
			.lean();

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	updateUser(id: string, updateUser: UpdateUser): Promise<User | null> {
		return this.userModel.findByIdAndUpdate(id, updateUser, {
			new: true,
			runValidators: true,
		});
	}

	removeUser(id: string): Promise<User | null> {
		return this.userModel.findByIdAndDelete(id);
	}
}
