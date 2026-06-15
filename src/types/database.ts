export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
  role: 'Yeni Üye' | 'Aktif Üye' | 'Uzman Kullanıcı' | 'Usta' | 'Master Usta' | 'Efsane Usta'
  xp: number
  created_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string
  created_at: string
}

export interface Model {
  id: string
  brand_id: string
  name: string
  slug: string
  created_at: string
  brands?: Brand
}

export interface EngineOption {
  name: string
  fuel: string
  consumption: string
}

export interface Generation {
  id: string
  model_id: string
  name: string
  slug: string
  years: string
  engines: EngineOption[]
  buying_guide: string
  image_url?: string
  body_type?: 'Sedan' | 'Hatchback' | 'SUV' | 'Coupe'
  min_price?: number
  max_price?: number
  created_at: string
  models?: Model
}

export interface Review {
  id: string
  generation_id: string
  user_id: string
  rating_engine: number
  rating_gearbox: number
  rating_electric: number
  rating_fuel: number
  rating_comfort: number
  rating_parts: number
  rating_mechanic: number
  content: string
  created_at: string
  profiles?: Profile
  comments_count?: number
}

export interface ProblemReport {
  id: string
  generation_id: string
  title: string
  description: string
  created_at: string
  yes_votes?: number
  no_votes?: number
  user_voted?: boolean
  user_vote_type?: boolean
}

export interface ProblemVote {
  id: string
  problem_id: string
  user_id: string
  vote_type: boolean
  created_at: string
}

export interface Comment {
  id: string
  review_id: string
  user_id: string
  content: string
  is_pinned: boolean
  likes: number
  dislikes: number
  created_at: string
  profiles?: Profile
  user_vote?: 'like' | 'dislike' | null
}

export interface CommentVote {
  id: string
  comment_id: string
  user_id: string
  vote_type: 'like' | 'dislike'
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  awarded_at: string
  badges?: Badge
}
