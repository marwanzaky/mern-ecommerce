import { SetMetadata } from "@nestjs/common";

import { UserRole } from "@/shared/types/user.type";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
