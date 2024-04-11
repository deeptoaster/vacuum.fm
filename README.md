# Vacuum.fm

Clean up your third-party Last.fm scrobbles

https://fishbotwilleatyou.com/vacuum/

## About

### What's Vacuum.fm?

**Vacuum.fm helps you clean up [Last.fm](https://last.fm/) scrobbles.** Not all
[scrobblers](https://support.last.fm/t/more-ways-to-scrobble/192) are created
equal. Some don't scrobble album titles, some spell artist names in different
ways, and some list all the artists on a track while others list only the main
act. Even if you only use one scrobbling service, it may still report the same
track inconsistently, such as if it was re-released on multiple albums or
compilations.

This can get annoying when you want to make [cool
visualizations](https://www.reddit.com/r/lastfm/comments/e686jf/still_working_stats_tools/)
or see your stats. With Vacuum.fm, you can fix these inconsistencies and give
your data a spring cleaning.

### How do I get started?

1.  First, you'll need a [Last.fm Pro account](https://www.last.fm/pro). (This
    is the only way to edit your old scrobbles. Sorry!)
2.  Use this tool to choose which clean-up actions you want to take. Don't
    worry&mdash;you'll see a full list of the changes to be made to your
    scrobbles at the end.
3.  Download your custom-generated Scrobble Updater script or bookmarklet and
    run it on the Last.fm website. It will automatically perform each of the
    scrobble edits you selected.

**This tool will guide you step-by-step.** Enjoy your clean data and happy
scrobbling!

### Warning: Use this tool at your own risk.

I've taken plenty of precautions to make sure this tool modifies scrobbles
correctly, but in the end, it is still a tool that automatically modifies
_your_ data on a third-party website. **I am not responsible for any data loss
or corruption that may occur.**

I highly recommend backing up your scrobbles before running your Scrobble
Updater script. There are many services online that will allow you to download
your scrobbles or push them to an alternative scrobble database. Here is a
partial list in no particular order:

- Last.fm Data Export [version 1](http://mainstream.ghan.nl/scrobbles.html)
  and [version 2](https://lastfm.ghan.nl/export/)
- [Last.fm to CSV](https://benjaminbenben.com/lastfm-to-csv/)
- [Last.fm Backup](https://musilytics.azurewebsites.net/LastFm/Backup)
- [Last.fm Exporter / Libre.fm
  Importer](https://digitalheir.github.io/lastfm-to-librefm-exporter/)

## Contributing

Feedback and contributions are always welcome! If you have any bug reports,
feature requests, or questions, please open a GitHub
[issue](https://github.com/deeptoaster/vacuum.fm/issues). To contribute, follow
the instructions below to set up local development and submit a GitHub [pull
request](https://github.com/deeptoaster/vacuum.fm/pulls).

## Local Development

You will need to have [Git](https://git-scm.com/doc), [Node.js, and
npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
installed.

1.  [Create a fork of deeptoaster/vacuum.fm to your own account and clone
    it.](https://help.github.com/en/articles/fork-a-repo)
2.  In the project directory, run `npm install` to install all dependencies.
3.  Run `npm start`. This should open the development webapp at
    http://localhost:8080/ in your browser.
4.  After making your changes, [commit
    them](https://git-scm.com/docs/gittutorial#_making_changes), push them to
    your fork on GitHub, and [create a pull
    request](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork)
    to deeptoaster/vacuum.fm.
