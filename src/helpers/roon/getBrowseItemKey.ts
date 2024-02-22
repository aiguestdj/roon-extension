import { RoonApiBrowseOptions, RoonCore } from 'roon-kit';
import { getBrowseResult } from './getBrowseResult';

export async function getBrowseItemKey(core: RoonCore, search: string, options: RoonApiBrowseOptions = { hierarchy: "browse" }) {
    const result = await getBrowseResult(core, options);
    for (let i = 0; i < result.items.length; i++) {
        const item = result.items[i];
        if (item.title == search)
            return item.item_key;
    }
}
