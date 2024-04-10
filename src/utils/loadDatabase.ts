/* eslint @typescript-eslint/no-unsafe-member-access: off */
import type { MutableRefObject } from 'react';

import type {
  Album,
  Artist,
  Database,
  DateSpan,
  Entities,
  EntityIndices
} from '../defs';
import makeIndex from './makeIndex';
import makeKey from './makeKey';

type Mutable<
  Brand extends keyof Entities,
  Indices extends keyof Entities[Brand]
> = {
  -readonly [Property in Exclude<
    keyof Entities[Brand],
    Indices
  >]: Entities[Brand][Property];
} & {
  [Property in Indices]: Record<number, true>;
} & { index: EntityIndices[Brand] };

export default async function loadDatabase(
  username: string,
  dateSpan: DateSpan,
  setTotalPages: (totalPages: number) => void,
  aborted: MutableRefObject<boolean>
): Promise<Database> {
  const artists: Record<string, Mutable<'artist', 'albums' | 'tracks'>> = {};
  let artistCount = 0;
  const albums: Record<string, Mutable<'album', 'tracks'>> = {};
  let albumCount = 0;
  const tracks: Record<string, Mutable<'track', never>> = {};
  let trackCount = 0;
  let totalPages = Infinity;

  for (let page = 0; page < totalPages; page += 1) {
    if (aborted.current) {
      throw new Error('Data loading cancelled.');
    }

    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?api_key=${process.env.LASTFM_KEY}&format=json&from=${Math.floor(Date.now() / 1000) - dateSpan * 86400}&limit=200&method=user.getrecenttracks&page=${page + 1}&user=${username}`
    ).then(async (response: Response) => response.json());

    ({ totalPages } = response.recenttracks['@attr']);
    setTotalPages(totalPages);

    for (
      let trackIndex = 0;
      trackIndex < response.recenttracks.track.length;
      trackIndex += 1
    ) {
      const track = response.recenttracks.track[trackIndex];

      if (track['@attr']?.nowplaying !== 'true') {
        const artistName: string = track.artist['#text'];
        const artistKey = makeKey(artistName);
        const albumName: string = track.album['#text'];
        const albumKey = makeKey(artistName, albumName);
        const trackName: string = track.name;
        const trackKey = makeKey(artistName, albumName, trackName);

        if (!(artistKey in artists)) {
          artists[artistKey] = {
            albums: {},
            count: 0,
            index: makeIndex<'artist'>(artistCount),
            name: artistName,
            tracks: {}
          };

          artistCount += 1;
        }

        if (!(albumKey in albums)) {
          albums[albumKey] = {
            artistIndex: artists[artistKey].index,
            count: 0,
            index: makeIndex<'album'>(albumCount),
            name: albumName,
            tracks: {}
          };

          artists[artistKey].albums[albumCount] = true;
          albumCount += 1;
        }

        if (!(trackKey in tracks)) {
          tracks[trackKey] = {
            albumIndex: albums[albumKey].index,
            artistIndex: artists[artistKey].index,
            count: 0,
            index: makeIndex<'track'>(trackCount),
            name: trackName,
            timestamp: Number(track.date.uts)
          };

          artists[artistKey].tracks[trackCount] = true;
          albums[albumKey].tracks[trackCount] = true;
          trackCount += 1;
        }

        artists[artistKey].count += 1;
        albums[albumKey].count += 1;
        tracks[trackKey].count += 1;
      }
    }
  }

  return {
    albums: Object.values(albums).map(
      (album: Mutable<'album', 'tracks'>): Album => ({
        ...album,
        tracks: Object.keys(album.tracks)
          .map(Number)
          .map(makeIndex<'track'>)
      })
    ),
    artists: Object.values(artists).map(
      (artist: Mutable<'artist', 'albums' | 'tracks'>): Artist => ({
        ...artist,
        albums: Object.keys(artist.albums)
          .map(Number)
          .map(makeIndex<'album'>),
        tracks: Object.keys(artist.tracks)
          .map(Number)
          .map(makeIndex<'track'>)
      })
    ),
    tracks: Object.values(tracks)
  };
}
