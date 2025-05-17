
import React from "react";
import { Heart, Calendar, Eye, UserCircle } from "lucide-react";
import { formatDate } from "@/components/wiki/WikiUtils";

interface WikiArticleMetaProps {
  authorName?: string;
  lastUpdated: Date;
  views: number;
  contributors: number;
  likes?: number;
  isLiked?: boolean;
}

export const WikiArticleMeta: React.FC<WikiArticleMetaProps> = ({
  authorName,
  lastUpdated,
  views,
  contributors,
  likes,
  isLiked,
}) => {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <UserCircle size={16} />
        <span>Author: {authorName || 'Unknown'}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar size={16} />
        <span>Last updated: {formatDate(lastUpdated)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Eye size={16} />
        <span>{views} views</span>
      </div>
      <div className="flex items-center gap-1.5">
        <UserCircle size={16} />
        <span>{contributors} contributors</span>
      </div>
      {likes !== undefined && (
        <div className="flex items-center gap-1.5">
          <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          <span>{likes || 0} likes</span>
        </div>
      )}
    </div>
  );
};
