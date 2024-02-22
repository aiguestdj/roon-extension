import { searchForTrack } from '@/helpers/roon/searchForTrack';
import { roon } from '@/library/roon';
import { generateError } from '@aiguestdj/shared/helpers/generateError';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export type GetTrackReponse = {
    artist: string
    name: string
    result: {
        artist?: string
        title?: string
        image?: string
    }[]
}

export type PostTrackData = {
    artist: string,
    name: string,
    spotify_artist: string | null,
    spotify_name: string | null,
    idx: number
}

const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            const items: PostTrackData[] = req.body.items;
            if (!items || items.length == 0)
                return res.status(400).json({ msg: "No items given" });

            const core = await roon.extension.get_core()
            const promises: Promise<GetTrackReponse>[] = []
            for (let i = 0; i < items.length && !res.destroyed; i++) {
                const { artist, name, spotify_artist, spotify_name } = items[i];
                const promise = new Promise<GetTrackReponse>(async (resolve, reject) => {
                    try {
                        let searchResult = await searchForTrack(core, artist, name, `Search-${artist}-${name}`)
                        if (searchResult.length == 0 && spotify_artist && spotify_name)
                            searchResult = await searchForTrack(core, spotify_artist, spotify_name, `Search-${artist}-${name}`)

                        resolve({
                            artist: artist,
                            name: name,
                            result: searchResult
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


