import { RoonCore } from 'roon-kit';
import { getBrowseItemKey } from './getBrowseItemKey';
import { getBrowseResult } from './getBrowseResult';
import { searchForTrack } from './searchForTrack';

export async function playTrack(core: RoonCore, artist: string, name: string, spotify_artist: string | null, spotify_name: string | null, songIdx: number, sessionKey: string, zoneId: string, enqueue: boolean) {
    let tracks = await searchForTrack(core, artist, name, sessionKey)
    if (tracks.length == 0 && spotify_artist && spotify_name)
        tracks = await searchForTrack(core, spotify_artist, spotify_name, sessionKey);

    const toPlayTrack = tracks[songIdx] ? tracks[songIdx] : tracks[0];
    if (toPlayTrack) {
        const actionListKey = await getBrowseItemKey(core, toPlayTrack.title, { multi_session_key: sessionKey, hierarchy: "search", item_key: toPlayTrack.item_key });
        if (enqueue) {
            const actionQueue = await getBrowseItemKey(core, "Queue", { multi_session_key: sessionKey, hierarchy: "search", item_key: actionListKey });
            if (actionQueue) {
                await getBrowseResult(core, { multi_session_key: sessionKey, hierarchy: "search", item_key: actionQueue, zone_or_output_id: zoneId })
                return true;
            }
        } else {
            const actionPlay = await getBrowseItemKey(core, "Play Now", { multi_session_key: sessionKey, hierarchy: "search", item_key: actionListKey });
            if (actionPlay) {
                await getBrowseResult(core, { multi_session_key: sessionKey, hierarchy: "search", item_key: actionPlay, zone_or_output_id: zoneId })
                return true;
            }
        }
    }
    return false;
}
