import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { RoonExtension, Zone } from 'roon-kit';
declare global {
    var _roon: {
        extension: RoonExtension,
        zones: Zone[],
        settings: { openai_key?: string }
    }
}

const storeConfiguration = () => {
    if (existsSync('config.json')) {

        if (!existsSync('config'))
            mkdirSync('config')

        copyFileSync('config.json', 'config/roon.json')
    }
}
let _roon = global._roon;
if (!_roon) {


    if (existsSync('config/roon.json') && !existsSync('config.json'))
        copyFileSync('config/roon.json', 'config.json');

    _roon = {
        extension: new RoonExtension({
            description: {
                extension_id: 'roon-aiguestdj',
                display_name: "AI Guest DJ",
                display_version: "1.0.0",
                publisher: 'Jaap den Hertog',
                email: 'jjdenhertog@gmail.com',
                website: 'https://aiguestdj.com'
            },
            RoonApiBrowse: 'required',
            RoonApiImage: 'required',
            RoonApiTransport: 'required',
            subscribe_outputs: false,
            subscribe_zones: true,
            log_level: 'none'
        }),
        zones: [],
        settings: {}
    }
    _roon.extension.start_discovery();
    _roon.extension.set_status("Extension starting");
    _roon.extension.get_core().then((core) => {
        roon.extension.set_status(`Core paired`);
        // Store configuration file
        storeConfiguration();
    });
    _roon.extension.on("subscribe_zones", (core, response, body) => {
        // Store configuration file
        storeConfiguration();

        if (!!body && body.zones) {
            _roon.zones = body.zones
        } else if (body && body.zones_added) {
            body.zones_added.forEach(zone => {
                let existingZone = _roon.zones.filter(item => item.zone_id == zone.zone_id)[0];
                if (!existingZone)
                    _roon.zones.push(zone);
            })
        } else if (body && body.zones_removed) {
            body.zones_removed.forEach(zone => {
                let existingZone = _roon.zones.filter(item => item.zone_id == zone.zone_id)[0];
                if (existingZone)
                    _roon.zones.splice(_roon.zones.indexOf(existingZone), 1)
            })
        } else if (body && body.zones_changed) {
            body.zones_changed.forEach(zone => {
                let existingZone = _roon.zones.filter(item => item.zone_id == zone.zone_id)[0];
                if (existingZone)
                    _roon.zones.splice(_roon.zones.indexOf(existingZone), 1, zone)
            })
        }
    })
}

export const roon = _roon;
if (process.env.NODE_ENV !== 'production') global._roon = _roon