/* eslint-disable func-names, no-alert, no-template-curly-in-string */
declare const flattenedChanges: ReadonlyArray<string>;

(function (): void {
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

    const csrfToken = new FormData(form).get('csrfmiddlewaretoken') as string;
    const request = new XMLHttpRequest();

    for (
      let changeIndex = 0;
      changeIndex < flattenedChanges.length;
      changeIndex += 1
    ) {
      request.open('POST', form.action, false);

      request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      request.send(
        `csrfmiddlewaretoken=${csrfToken}&${flattenedChanges[changeIndex]}&submit=edit-scrobble`
      );

      if (request.status !== 200) {
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
