import { GetTrackReponse } from "@/pages/api/tracks";
import { TrackSelection } from "@/pages/open/[id]";
import { errorBoundary } from "@aiguestdj/shared/helpers/errorBoundary";
import { GetPlaylistResponse } from "@aiguestdj/shared/types/AIGuestDJ";
import { Box, Button, CircularProgress, Grid } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import { Zone } from "roon-kit";
import { ZoneSelector } from "./ZoneSelector";

type Props = {
    playlist: GetPlaylistResponse
    loading:boolean
    tracks: GetTrackReponse[]
    selection: TrackSelection[]
}

export default function Playbar(props: Props) {
    const { playlist, tracks, selection, loading:loadingTracks } = props;
    const [zones, setZones] = useState<Zone[]>([])
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setLoading(true)

        errorBoundary(async () => {
            const result = await axios.get<Zone[]>('/api/zones')
            if (!result.data || result.data && result.data.length == 0)
                throw new Error("We couldn't find any Zones connected to your roon")
            setZones(result.data);
            setLoading(false)
        }, () => {
            setLoading(false)
        })
    }, [])

    const onZoneSelect = (id: string | null) => {
        if (id)
            localStorage.setItem('zone', id)
        setSelectedZoneId(id)
    }
    const onPlayClick = () => {
        const selectedZone = zones ? zones.filter(item => item.zone_id == selectedZoneId)[0] : undefined;
        if (selectedZone && tracks.length > 0) {
            errorBoundary(async () => {
                await axios.post('/api/play', {
                    items: playlist.tracks.map(item => {
                        const trackSelectIdx = selection.filter(selectionItem => selectionItem.artist == item.artist && selectionItem.name == item.name)[0]
                        const songIdx = trackSelectIdx ? trackSelectIdx.index : 0;
                        return {
                            artist: item.artist,
                            name: item.name,
                            spotify_artist: item.spotify_artist ? item.spotify_artist.split(",")[0] : null,
                            spotify_name: item.spotify_name,
                            idx: songIdx
                        }
                    }),
                    zone_id: selectedZone.zone_id
                })
            })
        }
    }

    const selectedZone = zones ? zones.filter(item => item.zone_id == selectedZoneId)[0] : undefined;
    return (
        <Box display={"flex"} justifyContent={"center"}>
            {loading && <CircularProgress size="md" />}
            {!loading &&
                <Grid container spacing={2}>
                    <Grid>
                        {zones &&
                            <ZoneSelector zones={zones} value={selectedZoneId} onSelect={onZoneSelect} />
                        }
                    </Grid>
                    <Grid>
                        <Button loading={loadingTracks} disabled={!selectedZone} onClick={onPlayClick}>Play</Button>
                    </Grid>

                </Grid>
            }
        </Box>

    )
}