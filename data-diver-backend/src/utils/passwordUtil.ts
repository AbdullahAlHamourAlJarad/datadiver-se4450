import { randomBytes, pbkdf2Sync } from 'crypto';

// Function to generate a hashed password and salt
export function generatePasswordHash(password: string): { salt: string, hashedPass: string } {
  const salt = randomBytes(16).toString('hex');
  const hashedPass = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  return { salt, hashedPass };
}

// Function to verify the password
export function verifyPassword(givenPassword: string, storedHash: string, salt: string): boolean {
  const hash = pbkdf2Sync(givenPassword, salt, 1000, 64, `sha512`).toString(`hex`);
  return storedHash === hash;
}