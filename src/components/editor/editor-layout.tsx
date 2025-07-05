import { PromptSection } from "./prompt-section";
import { Timeline } from "./timeline";
import { VideoPreview } from "./video-preview";

export function EditorLayout() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 h-full">
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full min-h-0">
          <VideoPreview />
        </div>
        <div className="h-full min-h-0">
          <PromptSection />
        </div>
      </div>
      <div className="h-[280px] lg:h-[320px]">
        <Timeline />
      </div>
    </div>
  );
}
