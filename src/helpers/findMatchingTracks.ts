import { compareTitles } from '@aiguestdj/shared/helpers/compareTitles';
import { Item } from 'roon-kit';
export function findMatchingTracks(items: Item[], artist: string, name: string, strict: boolean = false) {
    const foundTracks = items.map(item => {
        const result = {
            item_key: item.item_key,
            artist: item.subtitle,
            title: item.title,
            image: item.image_key,
            matching: {
                title: compareTitles(item.title, name),
                artist: compareTitles(item.subtitle || "", artist),
            }
        };
        return result;
    })
        .filter(item => (item.matching.artist.match || item.matching.artist.contains) &&
            (item.matching.title.match || item.matching.title.contains)
        )
        .sort((a, b) => {
            let aMatches = (a.matching.title.match ? 1 : 0) + (a.matching.artist.match ? 1 : 0);
            let bMatches = (b.matching.title.match ? 1 : 0) + (b.matching.artist.match ? 1 : 0);
            return aMatches - bMatches;
        });

    // Return only pure tracks
    if (foundTracks.filter(item => item.matching.artist.match && item.matching.title.match).length > 0)
        return foundTracks.filter(item => item.matching.artist.match && item.matching.title.match);

    return foundTracks
}