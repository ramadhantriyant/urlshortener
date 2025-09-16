import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public";

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export type Database = {
	public: {
		Tables: {
			urls: {
				Row: {
					id: string;
					user_id: string | null;
					original_url: string;
					short_code: string;
					title: string | null;
					description: string | null;
					clicks: number;
					is_active: boolean;
					expires_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id?: string | null;
					original_url: string;
					short_code: string;
					title?: string | null;
					description?: string | null;
					clicks?: number;
					is_active?: boolean;
					expires_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string | null;
					original_url?: string;
					short_code?: string;
					title?: string | null;
					description?: string | null;
					clicks?: number;
					is_active?: boolean;
					expires_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			clicks: {
				Row: {
					id: string;
					url_id: string;
					user_agent: string | null;
					referer: string | null;
					ip_address: string | null;
					country: string | null;
					city: string | null;
					clicked_at: string;
				};
				Insert: {
					id?: string;
					url_id: string;
					user_agent?: string | null;
					referer?: string | null;
					ip_address?: string | null;
					country?: string | null;
					city?: string | null;
					clicked_at?: string;
				};
				Update: {
					id?: string;
					url_id?: string;
					user_agent?: string | null;
					referer?: string | null;
					ip_address?: string | null;
					country?: string | null;
					city?: string | null;
					clicked_at?: string;
				};
			};
			user_profiles: {
				Row: {
					id: string;
					username: string | null;
					full_name: string | null;
					avatar_url: string | null;
					plan: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
					plan?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					username?: string | null;
					full_name?: string | null;
					avatar_url?: string | null;
					plan?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
	};
};
