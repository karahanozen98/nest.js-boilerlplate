import { SetMetadata } from '@nestjs/common';

import { ALLOW_ANON_KEY } from '../constant';

// enables role based authorization
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const AllowAnonymous = () => SetMetadata(ALLOW_ANON_KEY, true);
