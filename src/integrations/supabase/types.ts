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
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          sender_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          sender_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
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
        }
        Relationships: []
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
          last_updated: string | null
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
          last_updated?: string | null
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
          last_updated?: string | null
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
      decrement_counter_fn: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      increment_counter_fn: {
        Args: { row_id: string; column_name: string; table_name: string }
        Returns: undefined
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
