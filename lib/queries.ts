import "server-only"
import { createClient } from "@/lib/supabase/server"
import { ensureUserData } from "@/lib/seed"
import type { AnalyticsRow, AudienceRow, Channel, ReportRow, Video, Profile } from "@/lib/types"

/** Returns the authed user, or null. */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** Ensures the current user has a channel + demo data seeded. */
export async function getChannel(): Promise<Channel | null> {
  const user = await getUser()
  if (!user) return null
  await ensureUserData(user.id)
  const supabase = await createClient()
  const { data } = await supabase.from("channels").select("*").eq("user_id", user.id).limit(1).maybeSingle()
  return data as Channel | null
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
  return data as Profile | null
}

export async function getAnalytics(channelId: string, days = 90): Promise<AnalyticsRow[]> {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
  const { data } = await supabase
    .from("analytics")
    .select("*")
    .eq("channel_id", channelId)
    .gte("date", since)
    .order("date", { ascending: true })
  return (data as AnalyticsRow[]) ?? []
}

export async function getVideos(channelId: string): Promise<Video[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", channelId)
    .order("published_at", { ascending: false })
  return (data as Video[]) ?? []
}

export async function getVideo(channelId: string, videoId: string): Promise<Video | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", channelId)
    .eq("id", videoId)
    .maybeSingle()
  return data as Video | null
}

export async function getAudience(channelId: string): Promise<AudienceRow[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("audience").select("*").eq("channel_id", channelId)
  return (data as AudienceRow[]) ?? []
}

export async function getReports(): Promise<ReportRow[]> {
  const user = await getUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  return (data as ReportRow[]) ?? []
}

/* ---------- aggregation helpers ---------- */

export type Totals = {
  views: number
  subscribers: number
  watchTime: number
  revenue: number
  avgEngagement: number
}

export function sumWindow(rows: AnalyticsRow[], days: number): Totals {
  const slice = rows.slice(-days)
  const views = slice.reduce((a, r) => a + r.views, 0)
  const subscribers = slice.reduce((a, r) => a + r.subscribers, 0)
  const watchTime = slice.reduce((a, r) => a + Number(r.watch_time), 0)
  const revenue = slice.reduce((a, r) => a + Number(r.revenue), 0)
  const avgEngagement = slice.length ? slice.reduce((a, r) => a + Number(r.engagement_rate), 0) / slice.length : 0
  return { views, subscribers, watchTime, revenue, avgEngagement }
}
