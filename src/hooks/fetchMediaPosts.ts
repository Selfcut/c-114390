import { supabase } from "@/integrations/supabase/client";
import { ContentItemProps, ContentItemType } from "@/components/library/content-items/ContentItemTypes";
import { ContentViewMode } from "@/types/unified-content-types";

interface FetchMediaResult {
  data: ContentItemProps[] | null;
  error: Error | null;
}

export const fetchMediaPosts = async (page: number, viewMode: ContentViewMode): Promise<FetchMediaResult> => {
  try {
    const { data, error } = await supabase
      .from("media_posts")
      .select(`
        *,
        profiles:user_id(name, avatar_url, username)
      `)
      .order("created_at", { ascending: false })
      .range(page * 10, (page + 1) * 10 - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Map data to ContentItemProps format
    const mappedData: ContentItemProps[] = data.map((item: any) => ({
      id: item.id,
      type: ContentItemType.Media,
      title: item.title,
      content: item.content,
      mediaUrl: item.url,
      mediaType: item.type,
      author: {
        name: item.profiles?.name || 'Unknown Author',
        avatar: item.profiles?.avatar_url,
        username: item.profiles?.username,
      },
      createdAt: new Date(item.created_at),
      metrics: {
        likes: item.likes || 0,
        comments: item.comments || 0,
        views: item.views || 0,
      },
      tags: item.tags || [],
      viewMode,
    }));

    return { data: mappedData, error: null };
  } catch (err) {
    console.error("Error fetching media posts:", err);
    return { data: null, error: err as Error };
  }
};
