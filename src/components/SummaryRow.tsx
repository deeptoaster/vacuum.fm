import * as React from 'react';

import type { FlattenedChange } from '../defs';

import './SummaryRow.css';

export default function SummaryRow(props: FlattenedChange): JSX.Element {
  const { after, before } = props;

  return (
    <tr>
      <td>
        {before.artist !== after.artist ? (
          <del>{before.artist}</del>
        ) : (
          before.artist
        )}{' '}
        -{' '}
        {before.track !== after.track ? (
          <del>{before.track}</del>
        ) : (
          before.track
        )}
        <br />
        {before.album !== after.album ? (
          <del className="summary-album">{before.album}</del>
        ) : (
          <span className="summary-album">{before.album}</span>
        )}
      </td>
      <td>
        {before.artist !== after.artist ? (
          <ins>{after.artist}</ins>
        ) : (
          after.artist
        )}{' '}
        -{' '}
        {before.track !== after.track ? <ins>{after.track}</ins> : after.track}
        <br />
        {before.album !== after.album ? (
          <ins className="summary-album">{after.album}</ins>
        ) : (
          <span className="summary-album">{after.album}</span>
        )}
      </td>
    </tr>
  );
}
