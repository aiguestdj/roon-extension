import { roon } from '@/library/roon';
import { generateError } from '@aiguestdj/shared/helpers/generateError';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export type GetProfileResponse = { core_id: string, token: string }
const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(
        async (req, res, next) => {
            const core = await roon.extension.get_core();
            res.status(200).json({
                //@ts-ignore
                core_id: core.registration.core_id,
                //@ts-ignore
                token: core.registration.token,
            });
        })

export default router.handler({
    onNoMatch: (req, res) => {
        res.status(200).json({})
    },
    onError: (err: any, req, res) => {
        generateError(req, res, "Roon zones", err);
    },
});


