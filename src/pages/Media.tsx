
import React from "react";
import { MediaContainer } from "@/components/media/MediaContainer";
import { MediaErrorBoundary } from "@/components/ui/MediaErrorBoundary";

const Media = () => {
  return (
    <div className="p-6">
      <MediaErrorBoundary>
        <MediaContainer />
      </MediaErrorBoundary>
    </div>
  );
};

export default Media;
