import {
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { compare } from "bcrypt";
import { Model } from "mongoose";

import { CartsService } from "@/carts/carts.service";
import { UserRole } from "@/shared/types/user.type";
import { IRequest } from "@/types/request.type";
import { User } from "@/users/entities/user.entity";
import { UsersService } from "@/users/users.service";

import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private jwtService: JwtService,
		private configService: ConfigService,
		private cartsService: CartsService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
	) {}

	extractTokenFromHeader(request: IRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	async createAccessToken(userId: string, role: UserRole) {
		return await this.jwtService.sign(
			{ id: userId, role },
			{
				secret: this.configService.get("JWT_SECRET"),
				expiresIn: this.configService.get("JWT_EXPIRES"),
			},
		);
	}
	async loginWithGoogle(user: {
		email: string;
		firstName: string;
		lastName: string;
	}): Promise<{ token: string }> {
		const existingUser = await this.usersService
			.findByEmail(user.email)
			.catch(() => null);

		if (!existingUser) {
			const randomPassword = this.generatePassword();

			return await this.signUp({
				email: user.email,
				name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
				password: randomPassword,
			});
		}

		return {
			token: await this.createAccessToken(existingUser.id, existingUser.role),
		};
	}

	async signUp(signupDto: SignUpDto) {
		const user = await this.usersService.create(signupDto);

		await this.cartsService.create(user.id, []);

		return { token: await this.createAccessToken(user.id, user.role) };
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.userModel
			.findOne({
				email,
			})
			.select("+password");

		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new UnauthorizedException("Invalid email or password");
		}

		return { token: await this.createAccessToken(user.id, user.role) };
	}

	generatePassword() {
		const length = 8;
		const charset =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let retVal = "";

		for (let i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}
}
