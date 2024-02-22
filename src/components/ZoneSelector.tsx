import { Option, Select } from "@mui/joy";
import { Zone } from 'roon-kit';

type Props = {
    zones: Zone[];
    value: string|null;
    onSelect: (zoneId: string | null) => void;

}
export function ZoneSelector(props: Props) {
    const { zones, value: selectedZone, onSelect } = props;
    return (
        <>
            <Select placeholder="Select zone" value={selectedZone} onChange={(e, value) => onSelect(value)}>
                {zones.map(item => {
                    return <Option key={item.zone_id} value={item.zone_id}>{item.display_name}</Option>
                })}
            </Select>
        </>
    )
}