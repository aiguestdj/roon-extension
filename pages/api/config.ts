import { generateError } from '@aiguestdj/shared/helpers/generateError';
import { copyFileSync, existsSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(
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


