import * as React from 'react';
import { Link, Modal } from 'squiffles-components';

export default function Help(props: {
  hideHelp: () => void;
  visible: boolean;
}): JSX.Element {
  const { hideHelp, visible } = props;

  return (
    <Modal actions={[{ label: 'Close', onClick: hideHelp }]} visible={visible}>
      <h3>What's Vacuum.fm?</h3>
      <p>
        <strong>
          Vacuum.fm helps you clean up{' '}
          <Link external={true} href="https://last.fm/">
            Last.fm
          </Link>{' '}
          scrobbles.
        </strong>{' '}
        Not all{' '}
        <Link
          external={true}
          href="https://support.last.fm/t/more-ways-to-scrobble/192"
        >
          scrobblers
        </Link>{' '}
        are created equal. Some don't scrobble album titles, some spell artist
        names in different ways, and some list all the artists on a track while
        others list only the main act. Even if you only use one scrobbling
        service, it may still report the same track inconsistently, such as if
        it was re-released on multiple albums or compilations.
      </p>
      <p>
        This can get annoying when you want to make{' '}
        <Link
          external={true}
          href="https://www.reddit.com/r/lastfm/comments/e686jf/still_working_stats_tools/"
        >
          cool visualizations
        </Link>{' '}
        or see your stats. With Vacuum.fm, you can fix these inconsistencies and
        give your data a spring cleaning.
      </p>
      <h3>How do I get started?</h3>
      <ol>
        <li>
          First, you'll need a{' '}
          <Link external={true} href="https://www.last.fm/pro">
            Last.fm Pro account
          </Link>
          . (This is the only way to edit your old scrobbles. Sorry!)
        </li>
        <li>
          Use this tool to choose which clean-up actions you want to take. Don't
          worry&mdash;you'll see a full list of the changes to be made to your
          scrobbles at the end.
        </li>
        <li>
          Download your custom-generated Scrobble Updater script or bookmarklet
          and run it on the Last.fm website. It will automatically perform each
          of the scrobble edits you selected.
        </li>
      </ol>
      <p>
        <strong>This tool will guide you step-by-step.</strong> Enjoy your clean
        data and happy scrobbling!
      </p>
      <h3>Warning: Use this tool at your own risk.</h3>
      <p>
        I've taken plenty of precautions to make sure this tool modifies
        scrobbles correctly, but in the end, it is still a tool that
        automatically modifies <em>your</em> data on a third-party website.{' '}
        <strong>
          I am not responsible for any data loss or corruption that may occur.
        </strong>
      </p>
      <p>
        I highly recommend backing up your scrobbles before running your
        Scrobble Updater script. There are many services online that will allow
        you to download your scrobbles or push them to an alternative scrobble
        database. Here is a partial list in no particular order:
      </p>
      <ul>
        <li>
          Last.fm Data Export{' '}
          <Link external={true} href="http://mainstream.ghan.nl/scrobbles.html">
            version 1
          </Link>{' '}
          and{' '}
          <Link external={true} href="https://lastfm.ghan.nl/export/">
            version 2
          </Link>
        </li>
        <li>
          <Link
            external={true}
            href="https://benjaminbenben.com/lastfm-to-csv/"
          >
            Last.fm to CSV
          </Link>
        </li>
        <li>
          <Link
            external={true}
            href="https://musilytics.azurewebsites.net/LastFm/Backup"
          >
            Last.fm Backup
          </Link>
        </li>
        <li>
          <Link
            external={true}
            href="https://digitalheir.github.io/lastfm-to-librefm-exporter/"
          >
            Last.fm exporter / Libre.fm importer
          </Link>
        </li>
      </ul>
    </Modal>
  );
}
