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

  const namespace = 'vacuum';
  const popup =
    document.getElementById(`${namespace}-popup`) ??
    document.createElement('div');

  popup.id = `${namespace}-popup`;
  popup.className = 'popup_wrapper';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.right = '0';
  popup.style.bottom = '0';
  popup.style.left = '0';
  popup.innerHTML = `<div class="modal-dialog modal-content" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="modal-body"><h2 class="modal-title">Updating scrobbles&hellip;</h2><div class="content-form"><div class="form-horizontal"><div class="${namespace}-alert alert" style="display: none; margin: 24px 0;"></div><div style="position: relative;"><div class="${namespace}-progress-bar" style="background-color: rgba(185, 0, 0, 0.2); height: 30px;"></div><span class="${namespace}-progress-text" style="position: absolute; top: 0; right: 0; left: 0; line-height: 30px; font-weight: bold;"></span></div><div class="form-group" style="display: none;"><div class="form-submit"><button class="${namespace}-close btn-secondary">Close</button></div></div></div></div></div></div>`;

  const popupAlert = popup.getElementsByClassName(
    `${namespace}-alert`
  )[0] as HTMLDivElement;

  const popupProgressBar = popup.getElementsByClassName(
    `${namespace}-progress-bar`
  )[0] as HTMLDivElement;

  const popupProgressText = popup.getElementsByClassName(
    `${namespace}-progress-text`
  )[0];

  const popupClose = popup.getElementsByClassName(
    `${namespace}-close`
  )[0] as HTMLDivElement;

  popupClose.onclick = (): void => {
    document.body.removeChild(popup);
  };

  try {
    const libraryUrl = 'https://www.last.fm/user/${username}/library';
    const vacuumUrl = 'https://${process.env.ROOT}/vacuum/';

    document.body.appendChild(popup);

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
      const percentage = ((changeIndex + 1) / flattenedChanges.length) * 100;
      popupProgressBar.style.width = `${percentage}%`;
      popupProgressText.textContent = `${Math.round(percentage)}%`;

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

    popupAlert.textContent =
      'Scrobbles updated successfully! Please remember to delete the bookmarklet if you created one.';
    popupAlert.className += ' alert-success';
  } catch (error) {
    popupAlert.textContent = (error as Error).message;
    popupAlert.className += ' alert-danger';
  } finally {
    popupAlert.style.display = 'block';
    popupClose.style.display = 'block';
  }
})();
