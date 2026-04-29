import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation } from "@nestjs/swagger";

import { Response } from "express";

import { IRequest } from "@/types/request.type";

import { Public } from "./auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Public()
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("google")
	@UseGuards(AuthGuard("google"))
	async googleAuth() {}

	@Get("google/callback")
	@UseGuards(AuthGuard("google"))
	async googleAuthRedirect(@Req() req: IRequest, @Res() res: Response) {
		const clientUrl = process.env.CLIENT_URL!;

		const { token } = await this.authService.loginWithGoogle(req.user as any);

		return res.redirect(`${clientUrl}/auth/success?token=${token}`);
	}

	@Post("signup")
	@ApiOperation({
		summary: "Register a new user",
	})
	signUp(@Body() signupDto: SignUpDto) {
		return this.authService.signUp(signupDto);
	}

	@Post("login")
	@ApiOperation({
		summary: "Log in and get an access token",
	})
	signin(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
