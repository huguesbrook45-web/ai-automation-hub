import { Request } from 'express';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  stripe_customer_id?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
