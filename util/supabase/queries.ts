import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabaseClient } from "./hooks";
import dayjs from "dayjs";

export enum ScrobbleCountType {
  Album = "top_albums",
  Artist = "top_artists",
  Track = "top_tracks",
}

export enum ScrobbleTimeframe {
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
  AllTime = "all_time",
}

export function useScrobbleCounts<T>(
  type: ScrobbleCountType,
  timeframe: ScrobbleTimeframe
): [T[] | null, string | null, boolean, () => void] {
  const supabase = useSupabaseClient();
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
  }, [setIsRefreshing]);

  const fromTime =
    timeframe === ScrobbleTimeframe.AllTime
      ? 0
      : dayjs().startOf(timeframe).unix();

  const getCountData = useCallback(async () => {
    const { data: d, error: e } = await supabase.rpc<T>(type.toString(), {
      result_limit: 5,
      from_time: fromTime,
      to_time: dayjs().unix(),
    });

    setData(d);
    setError(e?.message ?? null);
    setLoading(false);
    setIsRefreshing(false);
  }, [fromTime, supabase, type]);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(false);
      getCountData();
    }
  }, [isRefreshing, getCountData]);

  return [data, error, loading, refresh];
}
