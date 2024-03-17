export const DONATION_URL =
  'https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Vacuum.fm&currency_code=USD';

export type Album = {
  readonly artistIndex: number;
  readonly count: number;
  readonly name: string;
  readonly tracks: Record<number, true>;
};

export type Artist = {
  readonly albums: Record<number, true>;
  readonly count: number;
  readonly name: string;
  readonly tracks: Record<number, true>;
};

export type ArtistSplit = {
  readonly artistIndex: number;
  readonly parts: ReadonlyArray<ArtistSplitPart>;
  readonly replacement: string;
};

export type ArtistSplitPart = {
  readonly included: boolean;
  readonly joiner: string;
  readonly name: string;
};

export type Database = {
  readonly albums: ReadonlyArray<Album>;
  readonly artists: ReadonlyArray<Artist>;
  readonly tracks: ReadonlyArray<Track>;
};

export type DateSpan = 0 | 7 | 30 | 90 | 180 | 365;

export type Entity = Album | Artist | Track;

export type PossibleDuplicate = {
  readonly leftIndex: number;
  readonly referenceEntityName: string | null;
  readonly rightIndex: number;
};

export enum Stage {
  SPLIT_ARTISTS,
  DEDUPLICATE_ARTISTS_BY_NAME,
  DEDUPLICATE_ALBUMS_BY_NAME,
  DEDUPLICATE_TRACKS_BY_NAME,
  DEDUPLICATE_ARTISTS_BY_TRACKS,
  DEDUPLICATE_ALBUMS_BY_TRACKS,
  length
}

export const STAGE_NAMES: Record<Exclude<Stage, Stage.length>, string> = {
  [Stage.SPLIT_ARTISTS]: 'Scrobbles With Multiple Artists',
  [Stage.DEDUPLICATE_ARTISTS_BY_NAME]: 'Artists With Similar Names',
  [Stage.DEDUPLICATE_ALBUMS_BY_NAME]: 'Albums With Similar Names',
  [Stage.DEDUPLICATE_TRACKS_BY_NAME]: 'Tracks With Similar Names',
  [Stage.DEDUPLICATE_ARTISTS_BY_TRACKS]: 'Same Album, Same Track',
  [Stage.DEDUPLICATE_ALBUMS_BY_TRACKS]: 'Same Artist, Same Track'
};

export class StageError extends Error {
  public constructor(
    message: string,
    public readonly artistIndex?: number
  ) {
    super(message);
    this.name = 'StageError';
  }
}

export type Track = {
  readonly albumIndex: number;
  readonly artistIndex: number;
  readonly count: number;
  readonly name: string;
};
