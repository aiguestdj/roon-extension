import { createSearchString } from './createSearchString';

export function compareTitles(a: string, b: string) {
    const match = a.localeCompare(b, "en", { sensitivity: "base", ignorePunctuation: false }) === 0;
    const contains = createSearchString(a).indexOf(createSearchString(b)) > -1 || createSearchString(b).indexOf(createSearchString(a)) > -1; 
    return { match, contains };
}
