import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";

import { Public } from "@/auth/auth.guard";
import { CloudinaryService } from "@/modules/cloudinary/cloudinary.service";

@Controller("uploads")
@Public()
export class UploadsController {
	constructor(private cloudinaryService: CloudinaryService) {}

	@Post()
	@ApiOperation({
		summary: "Upload file",
	})
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) throw new Error("No file provided");

		const url = await this.cloudinaryService.uploadFile(file);
		return { url };
	}
}
