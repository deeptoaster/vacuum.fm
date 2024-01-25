export type Album = {
  readonly artistIndex: number;
  readonly duplicates: Record<number, true>;
  readonly name: string;
  readonly tracks: Record<number, true>;
};

export type Artist = {
  readonly albums: Record<number, true>;
  readonly duplicates: Record<number, true>;
  readonly name: string;
  readonly tracks: Record<number, true>;
};

export type Database = {
  readonly albumCounter: number;
  readonly albums: Record<number, Album>;
  readonly artistCounter: number;
  readonly artists: Record<number, Artist>;
  readonly trackCounter: number;
  readonly tracks: Record<number, Track>;
};

export enum Stage {
  SPLIT_ARTISTS,
  length
}

export type Track = {
  readonly albumIndex: number;
  readonly artistIndex: number;
  readonly duplicates: Record<number, true>;
  readonly name: string;
};
