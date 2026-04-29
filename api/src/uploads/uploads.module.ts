import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/modules/cloudinary/cloudinary.module";

import { UploadsController } from "./uploads.controller";

@Module({
	imports: [CloudinaryModule],
	controllers: [UploadsController],
	providers: [],
})
export class UploadsModule {}
