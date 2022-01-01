export default interface Artist {
  id: number;
  spotify_id?: string;
  name: string;
  image_url: string;
  genres?: string[];
}
