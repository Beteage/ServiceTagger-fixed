import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

import app from '../server/src/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel serverless functions need to handle the request/response properly
    // We need to pass the request through the Express app
    return new Promise((resolve, reject) => {
        // Express apps are middleware functions that can be called with (req, res, next)
        app(req as any, res as any, (err: any) => {
            if (err) {
                console.error('Handler error:', err);
                reject(err);
            } else {
                resolve(undefined);
            }
        });
    });
}
