import { playTrack } from '@/helpers/roon/playTrack';
import { roon } from '@/library/roon';
import { generateError } from '@aiguestdj/shared/helpers/generateError';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { PostTrackData } from './tracks';


const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            const items: PostTrackData[] = req.body.items;
            if (!items || items.length == 0)
                return res.status(400).json({ msg: "No items given" });

            const zoneId: string = req.body.zone_id;
            if (!zoneId)
                return res.status(400).json({ msg: "No zoneId given" });

            const core = await roon.extension.get_core();
            let enqueueTrack = false;
            for (let i = 0; i < items.length && !res.destroyed; i++) {
                const { artist, name, spotify_artist, spotify_name, idx } = items[i];
                const success = await playTrack(core, artist, name, spotify_artist, spotify_name, idx, `Play-${artist}-${name}`, zoneId, enqueueTrack)
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


