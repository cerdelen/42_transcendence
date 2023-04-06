import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from './types';
import { request } from "http";

export const AuthUser = createParamDecorator(
	(
		data: string,
		ctx: ExecutionContext) => {
			const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
			const user = request.body;
			return data ? user && user[data] : user
		}
)
