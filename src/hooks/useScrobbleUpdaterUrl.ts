import { useMemo } from 'react';

import type { FlattenedChange } from '../defs';

// @ts-expect-error 2307
import scrobbleUpdater from '../../scrobbleUpdater.txt';

function encode(component: string): string {
  return encodeURIComponent(component).replace(/%20/g, '+');
}

export default function useScrobbleUpdaterUrl(
  flattenedChanges: ReadonlyArray<FlattenedChange>,
  username: string
): string {
  return useMemo(
    (): string =>
      `javascript:var flattenedChanges=['${flattenedChanges
        .map((change: FlattenedChange): string =>
          [
            `album_artist_name=${encode(change.after.artist)}`,
            `album_artist_name_original=${encode(change.before.artist)}`,
            `album_name=${encode(change.after.album)}`,
            `album_name_original=${encode(change.before.album)}`,
            `artist_name=${encode(change.after.artist)}`,
            `artist_name_original=${encode(change.before.artist)}`,
            `timestamp=${change.before.timestamp}`,
            `track_name=${encode(change.after.track)}`,
            `track_name_original=${encode(change.before.track)}`
          ].join('&')
        )
        .join("','")}'];${(scrobbleUpdater as string)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .replace(/\$\{process.env.ROOT\}/g, process.env.ROOT!)
        .replace(/\$\{timestamp\}/g, Date.now().toString())
        .replace(/\$\{username\}/g, username)}`,
    [flattenedChanges, username]
  );
}
