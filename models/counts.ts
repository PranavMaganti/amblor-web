import Album from "./album";
import Artist from "./artist";
import Track from "./track";

export interface TrackCounts {
  track: Track;
  listens: number;
}

export interface ArtistCounts {
  artist: Artist;
  listens: number;
}

export interface AlbumCounts {
  album: Album;
  listens: number;
}
