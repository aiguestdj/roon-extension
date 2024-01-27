import { RoonApiBrowseOptions, RoonCore } from 'roon-kit';



export async function getBrowseResult(core: RoonCore, options: RoonApiBrowseOptions = { hierarchy: "browse" }) {
    await core.services.RoonApiBrowse.browse({ ...options });
    return await core.services.RoonApiBrowse.load({ multi_session_key:options.multi_session_key, hierarchy: options.hierarchy });
}
