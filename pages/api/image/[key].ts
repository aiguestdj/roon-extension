import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { generateError } from 'src/helpers/generateError';
import { roon } from 'src/library/roon';

export const config = {
    api: {
        externalResolver: true,
    },
}

const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(
        async (req, res, next) => {
            const core = await roon.extension.get_core()
            const { key } = req.query;

            try {
                res.setHeader(
                    "Cache-Control",
                    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
                );
                res.setHeader("content-type", "image/png");
                const image = await core.services.RoonApiImage.get_image(`${key}`, { scale: 'fill', width: 140, height: 140 })
                const contentType = image.content_type
                const body = image.image

                res.setHeader("content-type", contentType);
                return res.status(200).send(body);
            } catch (error) {
                return res.status(404).end();
            }
        })

export default router.handler({
    onError: (err: any, req, res) => {
        generateError(req, res, "Roon zones", err);
    },
});