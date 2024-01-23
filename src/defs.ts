export type Album = {
  readonly artistIndex: number;
  readonly duplicates: { [index: number]: true };
  readonly name: string;
  readonly tracks: { [index: number]: true };
};

export type Artist = {
  readonly albums: { [index: number]: true };
  readonly duplicates: { [index: number]: true };
  readonly name: string;
  readonly tracks: { [index: number]: true };
};

export type Database = {
  readonly albumCounter: number;
  readonly albums: { [index: number]: Album };
  readonly artistCounter: number;
  readonly artists: { [index: number]: Artist };
  readonly trackCounter: number;
  readonly tracks: { [index: number]: Track };
};

export enum Stage {
  SPLIT_ARTISTS,
  length
}

export type Track = {
  readonly albumIndex: number;
  readonly artistIndex: number;
  readonly duplicates: { [index: number]: true };
  readonly name: string;
};
