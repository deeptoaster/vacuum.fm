import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Link } from 'squiffles-components';

import type { Database, FlattenedChange, FlattenedTrack, Track } from '../defs';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import SummaryRow from '../components/SummaryRow';
import useScrobbleUpdaterUrl from '../hooks/useScrobbleUpdaterUrl';

import './SummaryStage.css';

export default function SummaryStage(props: {
  finalDatabase: Database;
  initialDatabase: Database;
  username: string;
}): JSX.Element {
  const { finalDatabase, initialDatabase, username } = props;

  const flattenedInitialTracks = useMemo(
    (): ReadonlyArray<FlattenedTrack> =>
      initialDatabase.tracks.map(
        (track: Track): FlattenedTrack => ({
          artist: initialDatabase.artists[track.artistIndex].name,
          album: initialDatabase.albums[track.albumIndex].name,
          timestamp: track.timestamp,
          track: track.name
        })
      ),
    [initialDatabase]
  );

  const flattenedFinalTracks = useMemo(
    (): ReadonlyArray<FlattenedTrack> =>
      finalDatabase.tracks.map(
        (track: Track): FlattenedTrack => ({
          artist: finalDatabase.artists[track.artistIndex].name,
          album: finalDatabase.albums[track.albumIndex].name,
          timestamp: track.timestamp,
          track: track.name
        })
      ),
    [finalDatabase]
  );

  const flattenedChanges = useMemo(
    (): ReadonlyArray<FlattenedChange> =>
      flattenedInitialTracks.reduce(
        (
          changes: Array<FlattenedChange>,
          initialTrack: FlattenedTrack,
          trackIndex: number
        ): Array<FlattenedChange> => {
          const finalTrack = flattenedFinalTracks[trackIndex];

          if (
            initialTrack.artist !== finalTrack.artist ||
            initialTrack.album !== finalTrack.album ||
            initialTrack.track !== finalTrack.track
          ) {
            changes.push({ after: finalTrack, before: initialTrack });
          }

          return changes;
        },
        []
      ),
    [flattenedInitialTracks, flattenedFinalTracks]
  );

  const scrobbleUpdaterUrl = useScrobbleUpdaterUrl(flattenedChanges, username);

  const copyScrobbleUpdaterUrl = useCallback((): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.clipboard != null) {
      navigator.clipboard.writeText(scrobbleUpdaterUrl);
    }
  }, [scrobbleUpdaterUrl]);

  const libraryUrl = `https://www.last.fm/user/${username}/library`;

  return (
    <StageContainer
      buttonHref={scrobbleUpdaterUrl}
      buttonLabel="Scrobble Updater"
      onSubmit={copyScrobbleUpdaterUrl}
      stage={Stage.SUMMARY}
    >
      <p>Here is a summary of all the changes to be made to your scrobbles.</p>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Before</th>
            <th>After</th>
          </tr>
        </thead>
        <tbody>
          {flattenedChanges.map(
            (change: FlattenedChange, changeIndex: number): JSX.Element => (
              <SummaryRow key={changeIndex} {...change} />
            )
          )}
        </tbody>
      </table>
      <p>
        Your Last.fm Scrobble Updater script is ready. You can use it in one of
        two ways:
      </p>
      <h4>Method 1: Bookmarklet</h4>
      <ol>
        <li>
          Drag the Scrobble Updater button to your bookmarks bar. (You can also
          right-click on it and select <samp>Bookmark Link</samp>.)
        </li>
        <li>
          Open{' '}
          <Link external={true} href={libraryUrl}>
            {libraryUrl}
          </Link>
          . (Other Last.fm pages will not work.)
        </li>
        <li>
          Click on the Scrobble Updater bookmarklet you just added to your
          bookmarks bar.
        </li>
        <li>
          When the script is done running, delete the bookmarklet from your
          bookmarks bar.
        </li>
      </ol>
      <h4>Method 2: Developer Console</h4>
      <ol>
        <li>
          Click the Scrobble Updater button below to copy the script. (You can
          also right-click on it and select <samp>Copy Link</samp>.)
        </li>
        <li>
          Open{' '}
          <Link external={true} href={libraryUrl}>
            {libraryUrl}
          </Link>
          . (Other Last.fm pages will not work.)
        </li>
        <li>
          Open the developer console. (You can usually do this by pressing{' '}
          <kbd>F12</kbd> or <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>I</kbd>{' '}
          and clicking the <samp>Console</samp> tab.)
        </li>
        <li>
          Paste the script into the console and press <kbd>Enter</kbd>.
        </li>
      </ol>
    </StageContainer>
  );
}