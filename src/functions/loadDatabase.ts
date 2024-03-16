/* eslint @typescript-eslint/no-unsafe-member-access: off */
import type { MutableRefObject } from 'react';

import type { Album, Artist, Database, DateSpan, Track } from '../defs';

type Mutable<T> = {
  -readonly [Property in Exclude<keyof T, 'duplicates'>]: T[Property];
} & {
  index: number;
};

export default async function loadDatabase(
  username: string,
  dateSpan: DateSpan,
  setTotalPages: (totalPages: number) => void,
  aborted: MutableRefObject<boolean>
): Promise<Database> {
  const artists: Record<string, Mutable<Artist>> = {};
  let artistCount = 0;
  const albums: Record<string, Mutable<Album>> = {};
  let albumCount = 0;
  const tracks: Record<string, Mutable<Track>> = {};
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
        const artistName = track.artist['#text'];
        const artistKey = artistName;
        const albumName = track.album['#text'];
        const albumKey = `${artistKey} - ${albumName}`;
        const trackKey = `${albumKey} - ${track.name}`;

        if (!(artistKey in artists)) {
          artists[artistKey] = {
            albums: {},
            count: 0,
            index: artistCount,
            name: artistName,
            tracks: {}
          };

          artistCount += 1;
        }

        if (!(albumKey in albums)) {
          albums[albumKey] = {
            artistIndex: artists[artistKey].index,
            count: 0,
            index: albumCount,
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
            index: trackCount,
            name: track.name
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
    albums: Object.values(albums),
    artists: Object.values(artists),
    tracks: Object.values(tracks)
  };
}
