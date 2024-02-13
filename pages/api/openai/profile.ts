import { generateError } from '@/helpers/generateError';
import { settings } from '@/library/settings';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import OpenAI from 'openai';

const router = createRouter<NextApiRequest, NextApiResponse>()
    .get(
        async (req, res, next) => {

            if (!process.env.OPENAI_KEY || process.env.OPENAI_KEY.toLowerCase().indexOf('openai') > -1)
                res.status(400).json({ message: "OpenAI not configured" })

            try {
                const openai = new OpenAI({
                    apiKey: process.env.OPENAI_KEY, // This is the default and can be omitted
                });
                await openai.models.list();
                res.status(200).json(settings.data);
            } catch (e) {
                res.status(400).json({ message: "Failed connecting with OpenAI API" })
            }
        })

export default router.handler({
    onNoMatch: (req, res) => {
        res.status(200).json({})
    },
    onError: (err: any, req, res) => {
        console.log("err:", err)
        generateError(req, res, "Open AI Connection", err);
    },
});


