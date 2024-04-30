import { useMemo } from 'react';

import type { FlattenedChange } from '../defs';

// @ts-expect-error 2307
import scrobbleUpdater from '../../scrobbleUpdater.txt';

export default function useScrobbleUpdaterUrl(
  flattenedChanges: ReadonlyArray<FlattenedChange>,
  username: string
): string {
  return useMemo(
    (): string =>
      `javascript:var flattenedChanges=${JSON.stringify(flattenedChanges)};${(
        scrobbleUpdater as string
      )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .replace(/\$\{process.env.ROOT\}/g, process.env.ROOT!)
        .replace(/\$\{timestamp\}/g, Date.now().toString())
        .replace(/\$\{username\}/g, username)}`,
    [flattenedChanges, username]
  );
}
