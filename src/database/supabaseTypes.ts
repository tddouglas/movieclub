export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      club_sessions: {
        Row: {
          created_at: string | null
          date: string
          id: string
          poll_id: string | null
          season_id: string | null
          winning_movie_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          poll_id?: string | null
          season_id?: string | null
          winning_movie_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          poll_id?: string | null
          season_id?: string | null
          winning_movie_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_club_sessions_movie"
            columns: ["winning_movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_club_sessions_poll"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_club_sessions_season"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          created_at: string
          director: string | null
          id: string
          title: string
          year: number | null
        }
        Insert: {
          created_at?: string
          director?: string | null
          id?: string
          title: string
          year?: number | null
        }
        Update: {
          created_at?: string
          director?: string | null
          id?: string
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string | null
          id: string
          poll_id: string
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_id: string
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_poll_options_poll"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          cast_at: string | null
          id: string
          poll_id: string
          poll_option_id: string
          user_id: string
        }
        Insert: {
          cast_at?: string | null
          id?: string
          poll_id: string
          poll_option_id: string
          user_id: string
        }
        Update: {
          cast_at?: string | null
          id?: string
          poll_id?: string
          poll_option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_poll_votes_option"
            columns: ["poll_option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_poll_votes_poll"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_poll_votes_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          active: boolean | null
          closed_at: string | null
          created_at: string | null
          id: string
          nominator_id: string | null
          question: string
        }
        Insert: {
          active?: boolean | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          nominator_id?: string | null
          question: string
        }
        Update: {
          active?: boolean | null
          closed_at?: string | null
          created_at?: string | null
          id?: string
          nominator_id?: string | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_nominator_id_fkey"
            columns: ["nominator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          attendance_tracked: boolean
          end_date: string | null
          id: string
          name: string
          start_date: string | null
        }
        Insert: {
          attendance_tracked?: boolean
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
        }
        Update: {
          attendance_tracked?: boolean
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean
          club_title: string | null
          created_at: string
          display_name: string | null
          headshot_url: string | null
          id: string
          letterboxd_name: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          club_title?: string | null
          created_at?: string
          display_name?: string | null
          headshot_url?: string | null
          id?: string
          letterboxd_name?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          club_title?: string | null
          created_at?: string
          display_name?: string | null
          headshot_url?: string | null
          id?: string
          letterboxd_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      get_all_attendance: {
        Row: {
          display_name: string | null
          poll_id: string | null
          season_id: string | null
          title: string | null
          winning_movie_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_club_sessions_movie"
            columns: ["winning_movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_club_sessions_poll"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_club_sessions_season"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
