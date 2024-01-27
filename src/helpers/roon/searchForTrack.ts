import { RoonCore } from 'roon-kit';
import { findMatchingTracks } from '../findMatchingTracks';
import { getBrowseItemKey } from './getBrowseItemKey';
import { getBrowseResult } from './getBrowseResult';

export async function searchForTrack(core: RoonCore, artist: string, track: string,sessionKey:string) {
    let search = `${artist} ${track}`;
    const searchResultKey = await getBrowseItemKey(core, "Tracks", { multi_session_key: sessionKey, hierarchy: "search", input: search, pop_all: true });
    const searchResult = await getBrowseResult(core, { multi_session_key: sessionKey, hierarchy: "search", item_key: searchResultKey });
    const result = findMatchingTracks(searchResult.items, artist, track, true);
    if (result.length > 0) {
        return result;
    } else {
        let alternative = `${track}`;
        const searchResultKey = await getBrowseItemKey(core, "Tracks", { multi_session_key: sessionKey, hierarchy: "search", input: alternative, pop_all: true });
        const searchResult = await getBrowseResult(core, { multi_session_key: sessionKey, hierarchy: "search", item_key: searchResultKey });
        return findMatchingTracks(searchResult.items, artist, track);

    }
}
