import { copyFileSync, existsSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { generateError } from 'src/helpers/generateError';

const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            if (existsSync('config.json'))
                copyFileSync('config.json', 'config/config.json')

            res.status(200).json({ success: true })
        })

export default router.handler({
    onError: (err: any, req, res) => {
        generateError(req, res, "Roon zones", err);
    },
});


