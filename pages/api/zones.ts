import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { generateError } from 'src/helpers/generateError';
import { roon } from 'src/library/roon';

const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(
        async (req, res, next) => {
            res.status(200).json(roon.zones);
        })

export default router.handler({
    onError: (err: any, req, res) => {
        generateError(req, res, "Roon zones", err);
    },
});


