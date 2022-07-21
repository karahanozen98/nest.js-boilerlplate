import type { Request as Req } from 'express';

import type { IRequestSession } from './session.interface';

export type Request = Req & { session: IRequestSession; correlationId: string };
