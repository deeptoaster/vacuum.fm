import * as React from 'react';
import { useMemo } from 'react';

import type { Database, FlattenedChange, FlattenedTrack, Track } from '../defs';
import { Stage } from '../defs';
import StageContainer from '../components/StageContainer';
import SummaryRow from '../components/SummaryRow';

import './SummaryStage.css';

export default function SummaryStage(props: {
  finalDatabase: Database;
  initialDatabase: Database;
}): JSX.Element {
  const { finalDatabase, initialDatabase } = props;

  const flattenedInitialTracks = useMemo(
    (): ReadonlyArray<FlattenedTrack> =>
      initialDatabase.tracks.map(
        (track: Track): FlattenedTrack => ({
          artist: initialDatabase.artists[track.artistIndex].name,
          album: initialDatabase.albums[track.albumIndex].name,
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

  return (
    <StageContainer
      actionLabel="Download Script"
      onSubmit={(): void => {}}
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
    </StageContainer>
  );
}
