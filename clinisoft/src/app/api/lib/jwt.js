import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secreto-super-seguro';

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
