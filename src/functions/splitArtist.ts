import type { ArtistSplit, ArtistSplitPart } from '../defs';

export default function splitArtist(
  name: string,
  artistIndex: number
): ArtistSplit {
  return {
    artistIndex,
    parts: [...name.matchAll(/(.*?)((,? and |, )(?=[^a-z])|$)/g)]
      .map(
        (match: RegExpMatchArray): ArtistSplitPart => ({
          included: true,
          joiner: match[2],
          name: match[1]
        })
      )
      .slice(0, -1),
    replacement: name
  };
}
