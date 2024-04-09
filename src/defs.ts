export const DONATION_URL =
  'https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Vacuum.fm&currency_code=USD';

export type Album = {
  readonly artistIndex: ArtistIndex;
  readonly count: number;
  readonly name: string;
  readonly tracks: ReadonlyArray<TrackIndex>;
};

export type AlbumIndex = Branded<number, 'album'>;

export type Artist = {
  readonly albums: ReadonlyArray<AlbumIndex>;
  readonly count: number;
  readonly name: string;
  readonly tracks: ReadonlyArray<TrackIndex>;
};

export type ArtistIndex = Branded<number, 'artist'>;

export type ArtistSplit = {
  readonly artistIndex: ArtistIndex;
  readonly parts: ReadonlyArray<ArtistSplitPart>;
  readonly replacement: string;
};

export type ArtistSplitPart = {
  readonly included: boolean;
  readonly joiner: string;
  readonly name: string;
};

type Branded<Type, Brand extends keyof Entities> = Type & {
  __brand: Brand;
};

export type Database = {
  readonly albums: ReadonlyArray<Album>;
  readonly artists: ReadonlyArray<Artist>;
  readonly tracks: ReadonlyArray<Track>;
};

export type DateSpan = 0 | 7 | 30 | 90 | 180 | 365;
export type Entities = { album: Album; artist: Artist; track: Track };
export type EntityIndex = AlbumIndex | ArtistIndex | TrackIndex;

export type EntityIndices = {
  album: AlbumIndex;
  artist: ArtistIndex;
  track: TrackIndex;
};

export type FlattenedChange = { after: FlattenedTrack; before: FlattenedTrack };
export type FlattenedTrack = { album: string; artist: string; track: string };

export type PossibleDuplicate<Brand extends keyof Entities> = {
  readonly leftIndex: EntityIndices[Brand];
  readonly mandatory: boolean;
  readonly referenceEntityName: string | null;
  readonly rightIndex: EntityIndices[Brand];
};

export type Remappings<Brand extends keyof Entities> = Record<
  EntityIndices[Brand],
  EntityIndices[Brand] | null
>;

export enum Stage {
  SPLIT_ARTISTS,
  DEDUPLICATE_ARTISTS_BY_NAME,
  DEDUPLICATE_ALBUMS_BY_NAME,
  DEDUPLICATE_TRACKS_BY_NAME,
  DEDUPLICATE_ARTISTS_BY_TRACKS,
  DEDUPLICATE_ALBUMS_BY_TRACKS,
  SUMMARY,
  length
}

export const STAGE_NAMES: Record<Exclude<Stage, Stage.length>, string> = {
  [Stage.SPLIT_ARTISTS]: 'Scrobbles With Multiple Artists',
  [Stage.DEDUPLICATE_ARTISTS_BY_NAME]: 'Artists With Similar Names',
  [Stage.DEDUPLICATE_ALBUMS_BY_NAME]: 'Albums With Similar Names',
  [Stage.DEDUPLICATE_TRACKS_BY_NAME]: 'Tracks With Similar Names',
  [Stage.DEDUPLICATE_ARTISTS_BY_TRACKS]: 'Same Album, Same Track',
  [Stage.DEDUPLICATE_ALBUMS_BY_TRACKS]: 'Same Artist, Same Track',
  [Stage.SUMMARY]: 'Summary of Changes'
};

export class StageError extends Error {
  public constructor(
    message: string,
    public readonly artistIndex?: ArtistIndex
  ) {
    super(message);
    this.name = 'StageError';
  }
}

export type Track = {
  readonly albumIndex: AlbumIndex;
  readonly artistIndex: ArtistIndex;
  readonly count: number;
  readonly name: string;
};

export type TrackIndex = Branded<number, 'track'>;
