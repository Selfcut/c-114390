
import React from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { MediaContainer } from "@/components/media/MediaContainer";
import { MediaErrorBoundary } from "@/components/ui/MediaErrorBoundary";

const Media = () => {
  return (
    <MediaErrorBoundary>
      <PageLayout>
        <MediaContainer />
      </PageLayout>
    </MediaErrorBoundary>
  );
};

export default Media;
