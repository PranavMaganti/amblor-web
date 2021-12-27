import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

type Album = {
  id: string;
  name: string;
  cover_url: string;
};

type Artist = {
  id: string;
  name: string;
  image_url?: string;
  genres: string[];
};

type Track = {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  preview_url: string | null;
};

type UnmatchedTrack = {
  name: string;
  artist: string;
};

type ErrorMessage = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Track | ErrorMessage>
) {
  const supabaseKey = process.env.SUPABASE_KEY ?? "";
  const supabaseUrl = "https://rbtjlwyltzlpkrjzhqgs.supabase.co";
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!req.headers.authorization) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const user = await supabase.auth.api.getUser(
    req.headers.authorization.replace("Bearer ", "")
  );

  if (user.error) {
    console.log(user.error);
    res.status(401).json({ message: "Invalid Authorization header" });
    return;
  }

  const spotifyApi = await setupSpotifyApiClient();
  const query = req.query as UnmatchedTrack;
  console.log(query);
  const searchResults = await spotifyApi.searchTracks(
    `track:${getCleanTitle(query.name)} artist:${getMainArtist(query.artist)}`,
    { limit: 1 }
  );
  console.log(searchResults);

  const tracks = searchResults.body.tracks?.items;
  if (!tracks || tracks.length === 0) {
    res.status(404).json({ message: "No matching track found" });
    return;
  }

  const track = tracks[0];
  const artistsIds = track.artists.map((artist) => artist.id);
  const artistResults = await spotifyApi.getArtists(artistsIds);
  const artists = artistResults.body.artists;

  res.status(200).json({
    id: track.id,
    name: track.name,
    album: {
      id: track.album.id,
      name: track.album.name,
      cover_url: track.album.images[0].url,
    },
    artists: artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image_url: artist.images[0].url,
      genres: artist.genres,
    })),
    preview_url: track.preview_url,
  });
}

async function setupSpotifyApiClient() {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  const auth = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(auth.body["access_token"]);

  return spotifyApi;
}

function getCleanTitle(title: string): string {
  return title
    .replace(/\((feat.|From)(.*)\)/, "")
    .replace("'", "")
    .trim();
}

function getMainArtist(artistName: string): string {
  return artistName.replace("'", "").split(",")[0];
}
