import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { generateError } from 'src/helpers/generateError';
import { searchForTrack } from 'src/helpers/roon/searchForTrack';
import { roon } from 'src/library/roon';

export type GetTrackReponse = {
    ArtistName: string
    TrackName: string
    Result: {
        artist?: string
        title?: string
        image?: string
    }[]
}

const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            const items: { ArtistName: string, TrackName: string }[] = req.body.items;
            if (!items || items.length == 0)
                return res.status(400).json({ msg: "No items given" });

            const core = await roon.extension.get_core()
            const promises: Promise<GetTrackReponse>[] = []
            for (let i = 0; i < items.length && !res.destroyed; i++) {
                const { ArtistName, TrackName } = items[i];
                const promise = new Promise<GetTrackReponse>(async (resolve, reject) => {
                    try {
                        const searchResult = await searchForTrack(core, ArtistName, TrackName, `Search-${ArtistName}-${TrackName}`)
                        resolve({
                            ArtistName: ArtistName,
                            TrackName: TrackName,
                            Result: searchResult
                        })
                    } catch (e) {
                        reject("Something went wrong while searching")
                    }
                })
                promises.push(promise)
            }

            //@ts-ignore
            const result = (await Promise.allSettled(promises)).filter(item => item.status == "fulfilled").map(item => item.value)
            res.status(200).json(result);
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


