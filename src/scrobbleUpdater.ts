/* eslint-disable func-names, no-alert, no-template-curly-in-string */
import type { FlattenedChange } from './defs';

declare const flattenedChanges: ReadonlyArray<FlattenedChange>;

(function (): void {
  function encodeName(name: string): string {
    return encodeURIComponent(name).replace(/%20/g, '+');
  }

  function encodeChange(
    change: FlattenedChange,
    blankAlbumArtist: boolean
  ): string {
    return [
      `album_artist_name=${encodeName(change.after.artist)}`,
      `album_artist_name_original=${blankAlbumArtist ? '' : encodeName(change.before.artist)}`,
      `album_name=${encodeName(change.after.album)}`,
      `album_name_original=${encodeName(change.before.album)}`,
      `artist_name=${encodeName(change.after.artist)}`,
      `artist_name_original=${encodeName(change.before.artist)}`,
      `timestamp=${change.before.timestamp}`,
      `track_name=${encodeName(change.after.track)}`,
      `track_name_original=${encodeName(change.before.track)}`
    ].join('&');
  }

  function updateScrobble(
    request: XMLHttpRequest,
    action: string,
    csrfToken: string,
    change: FlattenedChange,
    blankAlbumArtist: boolean
  ): boolean {
    request.open('POST', action, false);

    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    request.send(
      `csrfmiddlewaretoken=${csrfToken}&${encodeChange(change, blankAlbumArtist)}&edit_all=on&submit=edit-scrobble`
    );

    return request.status === 200;
  }

  const libraryUrl = 'https://www.last.fm/user/${username}/library';

  try {
    const vacuumUrl = 'https://${process.env.ROOT}/vacuum/';

    if (Date.now() - Number('${timestamp}') > 300000) {
      throw new Error(
        `Scrobble updater expired. Please go back to ${vacuumUrl} and generate a new scrobble updater.`
      );
    }

    if (!`${window.location.href}?`.startsWith(`${libraryUrl}?`)) {
      throw new Error(`Please run this script at ${libraryUrl}.`);
    }

    const form = document.querySelector<HTMLFormElement>(
      'form[action^="/user/${username}/library/edit?"]'
    );

    if (form == null) {
      throw new Error('Could not find scrobble edit form.');
    }

    const { action } = form;
    const csrfToken = new FormData(form).get('csrfmiddlewaretoken') as string;
    const request = new XMLHttpRequest();

    for (
      let changeIndex = 0;
      changeIndex < flattenedChanges.length;
      changeIndex += 1
    ) {
      if (
        !updateScrobble(
          request,
          action,
          csrfToken,
          flattenedChanges[changeIndex],
          false
        ) &&
        !updateScrobble(
          request,
          action,
          csrfToken,
          flattenedChanges[changeIndex],
          true
        )
      ) {
        throw new Error(
          `Failed to update scrobble due to network error. Please go back to ${vacuumUrl} and generate a new scrobble updater.`
        );
      }
    }

    alert(
      'Scrobbles updated successfully! Please remember to delete the bookmarklet if you created one.'
    );
  } catch (error) {
    alert((error as Error).message);
  }
})();
