import Album from "./album";
import Artist from "./artist";

export default interface Track {
  id: number;
  spotify_id?: string;
  name: string;
  artists?: Artist[];
  album?: Album;
  preview_url: string;
}

