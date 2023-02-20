import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class Two_FA_Guard extends AuthGuard('Two-FA') {}