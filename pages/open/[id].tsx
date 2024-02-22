import Playbar from "@/components/Playbar";
import RoonTrack from "@/components/Playlists/RoonTrack";
import { errorBoundary } from "@aiguestdj/shared/helpers/errorBoundary";
import MainLayout from "@aiguestdj/shared/layouts/MainLayout";
import { GetPlaylistResponse } from "@aiguestdj/shared/types/AIGuestDJ";
import { Box, Divider, Sheet, Stack, Typography } from '@mui/joy';
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetTrackReponse } from "../api/tracks";

export type TrackSelection = {
    artist: string
    name: string
    index: number
}

const Page: NextPage = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingTracks, setLoadingTracks] = useState<boolean>(false);

    const [tracks, setTracks] = useState<GetTrackReponse[]>([]);
    const [trackSelections, setTrackSelections] = useState<TrackSelection[]>([])

    const [playlist, setPlaylist] = useState<GetPlaylistResponse>()

    const router = useRouter();

    // Loader
    useEffect(() => {
        if (!router.isReady) return
        errorBoundary(async () => {
            const playlistResult = await axios.get<GetPlaylistResponse>(`${process.env.NEXT_PUBLIC_AIGUESTDJ_URL || "https://aiguestdj.com"}/api/playlists/${router.query.id}`)
            setPlaylist(playlistResult.data)
            setLoading(false)
        }, () => {
        })
    }, [router.isReady])

    // Load tracks
    useEffect(() => {
        if (!playlist) return;

        if (tracks.length > 0) return;

        setLoadingTracks(true);
        const controller = new AbortController();
        errorBoundary(async () => {
            const tracks = playlist.tracks.map(item => ({ artist: item.artist, name: item.name, spotify_artist: item.spotify_artist ? item.spotify_artist.split(",")[0] : null, spotify_name: item.spotify_name }))
            const result = await axios.post<GetTrackReponse[]>('/api/tracks', {
                items: tracks
            }, { signal: controller.signal })
            setTracks(result.data);
            setTrackSelections(result.data.map(item => ({ artist: item.artist, name: item.name, index: 0 })))
            setLoadingTracks(false);
        }, () => {
            setLoadingTracks(false);
        }, true)
        return () => {
            controller.abort()
        }
    }, [playlist])

    const setTrackSelection = (artist: string, name: string, idx: number) => {
        setTrackSelections(items => items.map(item => {
            if (item.artist == artist && item.name == name)
                return { ...item, index: idx }
            return item;
        }))
    }

    return (<MainLayout>
        <Head>
            <title>AI Guest DJ | Designed for Roon</title>
        </Head>
        <Sheet sx={{ p: 1, md: { p: 3 }, mt: 10 }}>
            <Box maxWidth={650} margin={"0 auto"}>
                {playlist && <Box mt={1}>
                    <Box textAlign={"center"}>
                        <Typography level="h2">{playlist.name}</Typography>
                        <Typography level="body-sm" fontStyle={"italic"}>{playlist.prompt}</Typography>
                    </Box>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Box>
                        <Playbar loading={loadingTracks} playlist={playlist} tracks={tracks} selection={trackSelections} />
                    </Box>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Stack>
                        {playlist.tracks.map(track => {
                            const data = tracks.filter(item => track.artist == item.artist && track.name == item.name)[0];
                            const trackSelectIdx = trackSelections.filter(item => item.artist == track.artist && item.name == track.name)[0]
                            const songIdx = trackSelectIdx ? trackSelectIdx.index : 0;
                            return <RoonTrack key={`roon-${track.name}`} loading={loadingTracks} track={track} setSongIdx={(idx) => setTrackSelection(data.artist, data.name, idx)} songIdx={songIdx} data={data} />
                        })}
                    </Stack>
                </Box>}
            </Box>
        </Sheet>
    </MainLayout>
    )
}
export default Page;
