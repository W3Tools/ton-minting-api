import * as crypto from 'crypto';

export const jwtConfig = {
    maxAge: process.env.SESSION_MAX_AGE ? parseInt(process.env.SESSION_MAX_AGE) : 60 * 60 * 24 * 30,
    secretKey:
        process.env.SESSION_SECRET ||
        crypto.randomBytes(32)
            .toString('base64')
            .replace(/[^a-zA-Z0-9]+/g, ''),
};
