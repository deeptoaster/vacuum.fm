/* eslint-disable func-names, no-alert, no-template-curly-in-string */
import type { FlattenedChange } from './defs';

declare const flattenedChanges: ReadonlyArray<FlattenedChange>;

(async function (): Promise<void> {
  const parser = new DOMParser();

  function encodeName(name: string): string {
    return encodeURIComponent(name).replace(/%20/g, '+');
  }

  async function updateScrobble(
    action: string,
    csrfToken: string,
    change: FlattenedChange,
    blankAlbumArtist: boolean
  ): Promise<number | string | null> {
    const response = await fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: [
        `csrfmiddlewaretoken=${csrfToken}`,
        `edit_all=on&submit=edit-scrobble`,
        `album_artist_name=${encodeName(change.after.artist)}`,
        `album_artist_name_original=${blankAlbumArtist ? '' : encodeName(change.before.artist)}`,
        `album_name=${encodeName(change.after.album)}`,
        `album_name_original=${encodeName(change.before.album)}`,
        `artist_name=${encodeName(change.after.artist)}`,
        `artist_name_original=${encodeName(change.before.artist)}`,
        `timestamp=${change.before.timestamp}`,
        `track_name=${encodeName(change.after.track)}`,
        `track_name_original=${encodeName(change.before.track)}`
      ].join('&')
    });

    if (response.status !== 200) {
      return response.status;
    } else {
      const text = await response.text();
      const alerts = parser
        .parseFromString(text, 'text/html')
        .getElementsByClassName('alert-danger');

      return alerts.length > 0 ? alerts[0].textContent : null;
    }
  }

  const popup =
    document.getElementById('${namespace}-popup') ??
    document.createElement('div');

  popup.id = '${namespace}-popup';
  popup.className = 'popup_wrapper';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.right = '0';
  popup.style.bottom = '0';
  popup.style.left = '0';
  popup.innerHTML =
    '<div class="modal-dialog modal-content" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="modal-body"><h2 class="modal-title">Vacuum.fm Scrobble Updater</h2><div class="content-form"><div class="form-horizontal"><div class="${namespace}-alert alert" style="display: none; margin-top: 24px;"></div><div style="position: relative; margin-top: 24px; text-align: center;"><div class="${namespace}-progress-bar" style="background-color: rgba(185, 0, 0, 0.2); height: 30px;"></div><span class="${namespace}-progress-text" style="position: absolute; top: 0; right: 0; left: 0; line-height: 30px; font-weight: bold;">100%</span></div><div class="form-group"><div class="form-submit"><button class="${namespace}-close btn-primary" style="display: none;">Close</button></div></div></div></div></div></div>';

  const popupAlert = popup.getElementsByClassName(
    '${namespace}-alert'
  )[0] as HTMLDivElement;

  const popupProgressBar = popup.getElementsByClassName(
    '${namespace}-progress-bar'
  )[0] as HTMLDivElement;

  const popupProgressText = popup.getElementsByClassName(
    '${namespace}-progress-text'
  )[0];

  const popupClose = popup.getElementsByClassName(
    '${namespace}-close'
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

    for (
      let changeIndex = 0;
      changeIndex < flattenedChanges.length;
      changeIndex += 1
    ) {
      let percentage = ((changeIndex * 2 + 1) / flattenedChanges.length) * 50;

      popupProgressBar.style.width = `${percentage}%`;
      popupProgressText.textContent = `${Math.round(percentage)}%`;

      // eslint-disable-next-line no-await-in-loop
      const statusWithAlbumArtist = await updateScrobble(
        action,
        csrfToken,
        flattenedChanges[changeIndex],
        false
      );

      percentage = ((changeIndex + 1) / flattenedChanges.length) * 100;
      popupProgressBar.style.width = `${percentage}%`;
      popupProgressText.textContent = `${Math.round(percentage)}%`;

      // eslint-disable-next-line no-await-in-loop
      const statusWithoutAlbumArtist = await updateScrobble(
        action,
        csrfToken,
        flattenedChanges[changeIndex],
        true
      );

      if (statusWithAlbumArtist != null && statusWithoutAlbumArtist != null) {
        if (typeof statusWithAlbumArtist === 'string') {
          throw new Error(statusWithAlbumArtist);
        } else if (typeof statusWithoutAlbumArtist === 'string') {
          throw new Error(statusWithoutAlbumArtist);
        } else {
          throw new Error(
            `Failed to update scrobble due to network error. Please go back to ${vacuumUrl} and generate a new scrobble updater.`
          );
        }
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
