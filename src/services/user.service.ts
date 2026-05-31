import { ApiError } from "../lib/errors.ts";
import * as password from "../lib/password.ts";
import * as userRepository from "../repositories/user.repository.ts";

export async function createUser(
  email: string,
  plainPassword: string,
): Promise<userRepository.PublicUser> {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser !== null) {
    throw new ApiError(409, "El email ya está registrado");
  }

  const passwordHash = await password.hash(plainPassword);

  const user = await userRepository.create(email, passwordHash);

  const { password: _password, ...publicUser } = user;

  return publicUser;
}

export async function verifyCredentials(email: string, plainPassword: string): Promise<userRepository.PublicUser> {
  const user = await userRepository.findByEmail(email);

  if (user === null) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const isValid = await password.compare(plainPassword, user.password);

  if (!isValid) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const {password: _password, ...publicUser} = user; 

  return publicUser;
}

export async function getUserById(id: number): Promise<userRepository.PublicUser | null> {
  const user = await userRepository.findById(id);
  if (user === null) return null;
 
  const { password: _password, ...publicUser } = user;
  return publicUser;
}