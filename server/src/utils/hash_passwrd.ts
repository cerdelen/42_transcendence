import * as bcrypt from 'bcrypt';

export const hashPassword = (rawPassword: string) => {
	const salt = bcrypt.genSaltSync();
	return bcrypt.hashSync(rawPassword, salt);
}

export const comparePassword = (rawPassword: string, hash: string) => {
	return bcrypt.compareSync(rawPassword, hash); 
}  