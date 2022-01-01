import { Stack } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { AlbumCounts, ArtistCounts, TrackCounts } from "../models/counts";
import Card from "@mui/material/Card";
import {
  ScrobbleCountType,
  ScrobbleTimeframe,
  useScrobbleCounts,
} from "../util/supabase/queries";
import Image from "next/image";

const Home: NextPage = () => {
  const [scrobbleTimeframe, setScrobbleTimeframe] = useState(
    ScrobbleTimeframe.AllTime
  );

  const [trackData, trackError, trackLoading, trackRefresh] =
    useScrobbleCounts<TrackCounts>(ScrobbleCountType.Track, scrobbleTimeframe);
  const [albumData, albumError, albumLoading, albumRefresh] =
    useScrobbleCounts<AlbumCounts>(ScrobbleCountType.Album, scrobbleTimeframe);
  const [artistData, artistError, artistLoading, artistRefresh] =
    useScrobbleCounts<ArtistCounts>(
      ScrobbleCountType.Artist,
      scrobbleTimeframe
    );

  if (trackLoading || albumLoading || artistLoading) {
    return <div>Loading...</div>;
  }

  if (trackError || albumError || artistError) {
    return <div>Error: {trackError || albumError || artistError}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* <Stack spacing={2} style={{ flex: 1, alignItems: "center" }}>
        <h1>Top Tracks</h1>
        {trackData?.map((count) => (
          <div key={count.track.id}>
            <Card
              variant="outlined"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <p>{count.track.name}</p>
            </Card>
          </div>
        ))}
      </Stack> */}
    </div>
  );
};

export default Home;
