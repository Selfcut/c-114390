export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          author: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          genre: string | null
          id: string
          isbn: string | null
          published_year: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          isbn?: string | null
          published_year?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          isbn?: string | null
          published_year?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          reactions_count: number | null
          sender_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          reactions_count?: number | null
          sender_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          reactions_count?: number | null
          sender_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_bookmarks: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      content_comments: {
        Row: {
          comment: string
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_embeddings: {
        Row: {
          content_id: string
          content_text: string
          content_type: string
          created_at: string
          embedding: string | null
          id: string
        }
        Insert: {
          content_id: string
          content_text: string
          content_type: string
          created_at?: string
          embedding?: string | null
          id?: string
        }
        Update: {
          content_id?: string
          content_text?: string
          content_type?: string
          created_at?: string
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      content_likes: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_global: boolean | null
          is_group: boolean | null
          last_message: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_global?: boolean | null
          is_group?: boolean | null
          last_message?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          is_group?: boolean | null
          last_message?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          comments: number | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          tags: string[] | null
          title: string
          upvotes: number | null
          user_id: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title: string
          upvotes?: number | null
          user_id: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          tags?: string[] | null
          title?: string
          upvotes?: number | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      knowledge_entries: {
        Row: {
          categories: string[] | null
          comments: number | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          id: string
          is_ai_generated: boolean | null
          likes: number | null
          summary: string
          title: string
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          categories?: string[] | null
          comments?: number | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          likes?: number | null
          summary: string
          title: string
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          categories?: string[] | null
          comments?: number | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          likes?: number | null
          summary?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      media_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "media_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      media_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "media_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      media_posts: {
        Row: {
          comments: number | null
          content: string | null
          created_at: string | null
          id: string
          likes: number | null
          title: string
          type: string
          updated_at: string | null
          url: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          type: string
          updated_at?: string | null
          url?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          content?: string | null
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          type?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          is_ghost_mode: boolean | null
          name: string | null
          role: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          is_ghost_mode?: boolean | null
          name?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_ghost_mode?: boolean | null
          name?: string | null
          role?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      quote_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          quote_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quote_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quote_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_bookmarks_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          quote_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          quote_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          quote_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_comments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_likes: {
        Row: {
          created_at: string | null
          id: string
          quote_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quote_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quote_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_likes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author: string
          bookmarks: number | null
          category: string
          comments: number | null
          created_at: string | null
          id: string
          likes: number | null
          source: string | null
          tags: string[] | null
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          bookmarks?: number | null
          category: string
          comments?: number | null
          created_at?: string | null
          id?: string
          likes?: number | null
          source?: string | null
          tags?: string[] | null
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          bookmarks?: number | null
          category?: string
          comments?: number | null
          created_at?: string | null
          id?: string
          likes?: number | null
          source?: string | null
          tags?: string[] | null
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          author: string
          category: string
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_auto_fetched: boolean | null
          is_embedded: boolean | null
          likes: number | null
          published_date: string | null
          source: string | null
          source_url: string | null
          summary: string
          title: string
          updated_at: string | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          author: string
          category: string
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_auto_fetched?: boolean | null
          is_embedded?: boolean | null
          likes?: number | null
          published_date?: string | null
          source?: string | null
          source_url?: string | null
          summary: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          author?: string
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_auto_fetched?: boolean | null
          is_embedded?: boolean | null
          likes?: number | null
          published_date?: string | null
          source?: string | null
          source_url?: string | null
          summary?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_media_views: {
        Row: {
          id: string
          last_viewed_at: string | null
          media_id: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          id?: string
          last_viewed_at?: string | null
          media_id: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          id?: string
          last_viewed_at?: string | null
          media_id?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_media_views_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wiki_articles: {
        Row: {
          author_name: string | null
          category: string
          content: string | null
          contributors: number | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          last_updated: string | null
          tags: string[] | null
          title: string
          user_id: string
          views: number | null
        }
        Insert: {
          author_name?: string | null
          category: string
          content?: string | null
          contributors?: number | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          last_updated?: string | null
          tags?: string[] | null
          title: string
          user_id: string
          views?: number | null
        }
        Update: {
          author_name?: string | null
          category?: string
          content?: string | null
          contributors?: number | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          last_updated?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      decrement_counter: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
      }
      decrement_counter_fn: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_counter: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
      }
      increment_counter_fn: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
      }
      increment_media_views: {
        Args: { media_id: string }
        Returns: undefined
      }
      increment_research_views: {
        Args: { paper_id: string }
        Returns: undefined
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      semantic_search: {
        Args: {
          query_text: string
          content_type: string
          match_threshold?: number
          match_limit?: number
        }
        Returns: {
          content_id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      toggle_research_like: {
        Args: { paper_id: string; user_id: string }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      user_status:
        | "online"
        | "away"
        | "do-not-disturb"
        | "invisible"
        | "offline"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      user_status: ["online", "away", "do-not-disturb", "invisible", "offline"],
    },
  },
} as const
