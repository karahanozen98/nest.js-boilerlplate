import { SetMetadata } from '@nestjs/common';

import { ALLOW_ANON_KEY, ROLES } from '../common/constants';

// enables role based authorization
export const Roles = (...roles: string[]) => SetMetadata(ROLES, roles);
export const AllowAnonymous = () => SetMetadata(ALLOW_ANON_KEY, true);
