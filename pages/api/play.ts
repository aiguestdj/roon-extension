import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { generateError } from 'src/helpers/generateError';
import { playTrack } from 'src/helpers/roon/playTrack';
import { roon } from 'src/library/roon';


const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            const items: { ArtistName: string, TrackName: string, idx: number }[] = req.body.items;
            if (!items || items.length == 0)
                return res.status(400).json({ msg: "No items given" });

            const zoneId: string = req.body.zone_id;
            if (!zoneId)
                return res.status(400).json({ msg: "No zoneId given" });

            const core = await roon.extension.get_core();
            let enqueueTrack = false;
            for (let i = 0; i < items.length && !res.destroyed; i++) {
                const { ArtistName, TrackName, idx } = items[i];
                const success = await playTrack(core, ArtistName, TrackName, idx, `Play-${ArtistName}-${TrackName}`, zoneId, enqueueTrack)
                if (success)
                    enqueueTrack = true;
            }
            res.status(200).json({ ok: true });
        })


export default router.handler({
    onNoMatch: (req, res) => {
        res.status(200).json({})
    },
    onError: (err: any, req, res) => {
        console.log(err);
        generateError(req, res, "Songs", err);
    }
});


