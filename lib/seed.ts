import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Seeds realistic demo analytics for a new user so the product is meaningful
 * on first login. Uses the service-role key on the server, always scoped to
 * the given userId. Idempotent: skips if the user already has a channel.
 */

const VIDEO_TITLES = [
  "I Rebuilt My Studio in 48 Hours (Full Tour)",
  "The Editing Trick Nobody Talks About",
  "5 Habits That Doubled My Watch Time",
  "Why Your Thumbnails Aren't Working",
  "Reacting to My First Ever Video",
  "How I Plan a Month of Content in One Day",
  "The Gear I Actually Use (2026 Setup)",
  "Answering Your Most Asked Questions",
  "I Tried Posting Daily for 30 Days",
  "The Algorithm Explained (No Fluff)",
  "Behind the Scenes of a Viral Video",
  "My Honest Take on Creator Burnout",
  "Turning $0 Into a Full-Time Channel",
  "The One Setting That Changed Everything",
  "A Day in the Life of a Full-Time Creator",
  "How to Hook Viewers in the First 10 Seconds",
  "I Analyzed 100 Viral Shorts — Here's What I Found",
  "The Truth About Sponsorships",
]

const COUNTRIES = [
  { country: "United States", pct: 34 },
  { country: "United Kingdom", pct: 12 },
  { country: "Canada", pct: 9 },
  { country: "Germany", pct: 8 },
  { country: "Australia", pct: 6 },
  { country: "India", pct: 11 },
  { country: "Brazil", pct: 7 },
  { country: "Other", pct: 13 },
]

const AGE_GROUPS = [
  { age_group: "13-17", pct: 6 },
  { age_group: "18-24", pct: 31 },
  { age_group: "25-34", pct: 38 },
  { age_group: "35-44", pct: 15 },
  { age_group: "45-54", pct: 7 },
  { age_group: "55+", pct: 3 },
]

const GENDERS = [
  { gender: "Male", pct: 62 },
  { gender: "Female", pct: 35 },
  { gender: "Other", pct: 3 },
]

const TRAFFIC_SOURCES = ["Browse features", "Suggested videos", "Search", "External", "Direct / notifications"]

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function adminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function ensureUserData(userId: string) {
  const supabase = adminClient()

  const { data: existing } = await supabase.from("channels").select("id").eq("user_id", userId).limit(1)
  if (existing && existing.length > 0) return

  // 1. Channel
  const subscribers = Math.round(rand(48000, 92000))
  const { data: channel, error: chErr } = await supabase
    .from("channels")
    .insert({
      user_id: userId,
      platform: "youtube",
      channel_name: "Studio Signal",
      channel_handle: "@studiosignal",
      channel_url: "https://youtube.com/@studiosignal",
      subscriber_count: subscribers,
    })
    .select("id")
    .single()

  if (chErr || !channel) throw chErr ?? new Error("Failed to create channel")
  const channelId = channel.id

  // 2. Videos
  const now = Date.now()
  const videos = VIDEO_TITLES.map((title, i) => {
    const daysAgo = i * 5 + Math.round(rand(0, 3))
    const publishedAt = new Date(now - daysAgo * 86400000)
    const isShort = i % 4 === 0
    const views = Math.round(rand(isShort ? 40000 : 12000, isShort ? 480000 : 210000))
    const likes = Math.round(views * rand(0.03, 0.08))
    const comments = Math.round(views * rand(0.002, 0.009))
    const watch = +(views * rand(isShort ? 0.004 : 0.045, isShort ? 0.01 : 0.11)).toFixed(1)
    const ctr = +rand(3.2, 11.8).toFixed(1)
    const engagement = +(((likes + comments) / views) * 100).toFixed(1)
    const revenue = +(views * rand(0.0015, 0.0055)).toFixed(2)
    return {
      channel_id: channelId,
      title,
      description: "Demo content generated for your CreatorPulse workspace.",
      status: "published",
      content_type: isShort ? "short" : "video",
      published_at: publishedAt.toISOString(),
      views,
      likes,
      comments,
      watch_time: watch,
      ctr,
      engagement_rate: engagement,
      revenue,
    }
  })
  await supabase.from("videos").insert(videos)

  // 3. Analytics — 90 days, with growth trend + weekly seasonality
  const analytics: Record<string, unknown>[] = []
  let subs = subscribers - 6000
  const baseViews = rand(9000, 14000)
  for (let d = 89; d >= 0; d--) {
    const date = new Date(now - d * 86400000)
    const dow = date.getDay()
    const weekend = dow === 0 || dow === 6 ? 1.18 : 1
    const trend = 1 + (89 - d) * 0.006
    const noise = rand(0.82, 1.2)
    const views = Math.round(baseViews * weekend * trend * noise)
    const dailySub = Math.round(rand(20, 140) * trend)
    subs += dailySub
    const watch = +(views * rand(0.05, 0.09)).toFixed(1)
    const engagement = +rand(4.1, 7.6).toFixed(1)
    const revenue = +(views * rand(0.0018, 0.0045)).toFixed(2)
    analytics.push({
      channel_id: channelId,
      date: date.toISOString().slice(0, 10),
      views,
      subscribers: dailySub,
      watch_time: watch,
      engagement_rate: engagement,
      revenue,
      traffic_source: TRAFFIC_SOURCES[Math.floor(rand(0, TRAFFIC_SOURCES.length))],
    })
  }
  await supabase.from("analytics").insert(analytics)

  // 4. Audience
  const audience: Record<string, unknown>[] = []
  for (const a of AGE_GROUPS) audience.push({ channel_id: channelId, dimension: "age", age_group: a.age_group, percentage: a.pct })
  for (const g of GENDERS) audience.push({ channel_id: channelId, dimension: "gender", gender: g.gender, percentage: g.pct })
  for (const c of COUNTRIES) audience.push({ channel_id: channelId, dimension: "country", country: c.country, percentage: c.pct })
  for (let h = 0; h < 24; h++) {
    const peak = Math.exp(-Math.pow(h - 19, 2) / 30) + Math.exp(-Math.pow(h - 12, 2) / 40) * 0.6
    audience.push({ channel_id: channelId, dimension: "hour", hour: h, percentage: +(peak * 8).toFixed(1) })
  }
  audience.push({ channel_id: channelId, dimension: "type", viewer_type: "Returning", percentage: 58 })
  audience.push({ channel_id: channelId, dimension: "type", viewer_type: "New", percentage: 42 })
  await supabase.from("audience").insert(audience)

  // 5. Reports
  const reports = [
    { title: "Monthly Performance — This Month", period: "month" },
    { title: "Last 90 Days Overview", period: "quarter" },
    { title: "Audience Deep Dive", period: "custom" },
  ].map((r) => ({
    user_id: userId,
    title: r.title,
    period: r.period,
    status: "ready",
    period_end: new Date(now).toISOString().slice(0, 10),
  }))
  await supabase.from("reports").insert(reports)
}
