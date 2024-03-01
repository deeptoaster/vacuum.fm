export type Album = {
  readonly artistIndex: number;
  readonly count: number;
  readonly duplicates: Record<number, true>;
  readonly name: string;
  readonly tracks: Record<number, true>;
};

export type Artist = {
  readonly albums: Record<number, true>;
  readonly count: number;
  readonly duplicates: Record<number, true>;
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
  readonly albumCount: number;
  readonly albums: Record<number, Album>;
  readonly artistCount: number;
  readonly artists: Record<number, Artist>;
  readonly trackCount: number;
  readonly tracks: Record<number, Track>;
};

export type DateSpan = 0 | 7 | 30 | 90 | 180 | 365;

export enum Stage {
  SPLIT_ARTISTS,
  length
}

export class StageError extends Error {
  public constructor(
    message: string,
    public readonly focus: () => void
  ) {
    super(message);
    this.name = 'StageError';
  }
}

export type Track = {
  readonly albumIndex: number;
  readonly artistIndex: number;
  readonly count: number;
  readonly duplicates: Record<number, true>;
  readonly name: string;
};
