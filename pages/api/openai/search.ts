import { generateError } from '@/helpers/generateError';
import { settings } from '@/library/settings';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import OpenAI from 'openai';

const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res, next) => {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_KEY, // This is the default and can be omitted
            });

            if (!req.body.search || (req.body.search && req.body.search.length < 8))
                return res.status(400).json({ message: "The search query seems to short to create a good playlist." })

            const chatCompletion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system', content: `
                    You are an GPT that generating music playlists. 
                    Each playlist should contain at least 15 songs. Preferrably around 20 to 30 songs.
                    You should be mindfull the make meaningfull matches between the songs. 
                    Try to not include instrumental versions except when explicitly requested.
                    You will be gathering the following data of a playlist: 
                    - The name of the playlist: This should be generated using the prompt as basis
                    - The genre of the playlist: This should be a broad genre, for example "Jazz" instead of "Vocal Jazz"
                    - The prompt used to create the playlist
                    - A list of songs (between 15 and 30 songs). Each song should contain:
                        - The name of the artist
                        - The name of the track
                        - The name of the album, if this is available. Otherwise leave it empty
                        - The reason why you have chosen this track 
                    Your only function is to create a playlist. Even if the user does not explicitly mention that you should create a playlist.
                    When no songs are found you should return a JSON object, which should be structured as follows:
                    {
                        "Message": "The reason why you could not find any songs"
                    },
                    When you have found songs you should return a JSON object with the playlist, including the songs songs. This JSON object should be structured as following:
                    {
                        "Name": "The name of the playlist",
                        "Genre": "The genre of the playlist",
                        "Prompt": "The prompt used to generate the playlist",
                        "Items": [
                            { 
                                "ArtistName": "Name of the artist",
                                "TrackName": "The name of the track",
                                "AlbumName": "The name of the album",
                                "Reason": "The reason why this song was added to the playlist"
                            }
                        ]
                    }
                    `
                    },
                    { role: 'user', content: req.body.search }
                ],
                model: req.body.gpt4 ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo-1106'
            });
            try {
                if (chatCompletion.choices[0] && chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {

                    let json = chatCompletion.choices[0].message.content;
                    if (json.indexOf('{') > 0)
                        json = json.substring(json.indexOf('{'));

                    if (json.lastIndexOf('}') < json.length - 1)
                        json = json.substring(0, json.lastIndexOf('}') + 1)

                    const data = JSON.parse(json);
                    if (!data.Name || !data.Prompt || !data.Genre || !data.Items) {
                        return res.status(400).json({ message: data.Message || "Could not create a playlist based on your prompt" });
                    }

                    // Store usage
                    let usage = chatCompletion.usage?.total_tokens;
                    const requests = settings.data && settings.data.requests ? settings.data.requests || [] : [];
                    requests.push({
                        prompt: data.Prompt,
                        tokens: usage || 0
                    })
                    settings.saveConfig({ requests })

                    // Return data
                    res.status(200).json({
                        Name: data.Name,
                        Prompt: data.Prompt,
                        Genre: data.Genre,
                        gpt4: !!req.body.gpt4,
                        Items: data.Items
                    })
                }

            } catch (e) {
                //@ts-expect-error
                res.status(400).json({ message: e.message || "Something went wrong creating the playlist" });
            }
        })

export default router.handler({
    onNoMatch: (req, res) => {
        res.status(200).json({})
    },
    onError: (err: any, req, res) => {
        generateError(req, res, "GPT Prompt", err);
    },
});


