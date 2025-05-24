
import React from "react";
import { MediaContainer } from "@/components/media/MediaContainer";
import { MediaErrorBoundary } from "@/components/ui/MediaErrorBoundary";

const Media = () => {
  return (
    <MediaErrorBoundary>
      <MediaContainer />
    </MediaErrorBoundary>
  );
};

export default Media;
