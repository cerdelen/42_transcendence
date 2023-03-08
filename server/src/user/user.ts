// import { User } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { FindUserParams, CreateUserDetails, UserUpdateInput } from 'src/utils/types';
// import { UserWhereUniqueInput } from '../utils/types';


// export interface IUserService {
// 	createUser(createUserDetails: CreateUserDetails): Promise<User>;
// 	deleteUser(createUserDetails: CreateUserDetails);
// 	findUserById(findUserParams: FindUserParams): Promise<User | undefined>;
// 	updateUser(params: {
// 		where: UserWhereUniqueInput, data: UserUpdateInput}): Promise<User>;
// 	turn_on_2FA(user_id: number);
// 	turn_off_2FA(user_id: number);
// }