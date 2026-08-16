export type Channel = {
  id: string
  user_id: string
  platform: string
  channel_name: string
  channel_handle: string | null
  channel_url: string | null
  subscriber_count: number
  avatar_url: string | null
  created_at: string
}

export type Video = {
  id: string
  channel_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  status: "published" | "scheduled" | "draft"
  content_type: "video" | "short" | "live"
  published_at: string | null
  views: number
  likes: number
  comments: number
  watch_time: number
  ctr: number
  engagement_rate: number
  revenue: number
  created_at: string
}

export type AnalyticsRow = {
  id: string
  channel_id: string
  date: string
  views: number
  subscribers: number
  watch_time: number
  engagement_rate: number
  revenue: number
  traffic_source: string | null
}

export type AudienceRow = {
  id: string
  channel_id: string
  dimension: "age" | "gender" | "country" | "hour" | "type"
  age_group: string | null
  gender: string | null
  country: string | null
  hour: number | null
  viewer_type: string | null
  percentage: number
  date: string | null
}

export type ReportRow = {
  id: string
  user_id: string
  title: string
  period: string | null
  period_start: string | null
  period_end: string | null
  status: "ready" | "generating"
  report_data: Record<string, unknown> | null
  created_at: string
}

export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
}
