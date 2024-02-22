import { GetTrackReponse } from "@/pages/api/tracks";
import Track from '@aiguestdj/shared/components/Track';

type Props = {
    loading: boolean
    track: {
        artist: string;
        name: string;
        reason: string;
    },
    data?:GetTrackReponse
    songIdx: number
    setSongIdx?: (idx: number) => void
}
export default function RoonTrack(props: Props) {
    const songs = props.data ? props.data.result.map(item => {
        const thumbUrl = item.image ? `/api/image/${item.image}` : ""
        return {
            trackName: item.title || "",
            artistName: item.artist || "",
            thumb: thumbUrl,
        }
    }) : []

    return <Track
        loading={props.loading}
        trackName={props.track.name}
        artistName={props.track.artist}
        reason={props.track.reason}
        songs={songs}
        songIdx={props.songIdx}
        setSongIdx={props.setSongIdx}
    />

}