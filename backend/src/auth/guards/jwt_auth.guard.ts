import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class Jwt_Auth_Guard extends AuthGuard('jwt') {}