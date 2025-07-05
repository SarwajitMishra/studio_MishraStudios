import { cn } from "@/lib/utils";
import { GripVertical, Mic, Music, Video, Image as ImageIcon } from "lucide-react";

interface TimelineTrackProps {
  type: "video" | "audio" | "voice" | "image";
  label: string;
  clips: { start: number; end: number; color: string }[];
}

const typeIcons = {
  video: <Video className="w-4 h-4" />,
  audio: <Music className="w-4 h-4" />,
  voice: <Mic className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
};

export function TimelineTrack({ type, label, clips }: TimelineTrackProps) {
  return (
    <div className="flex items-stretch h-20 border-b last:border-b-0">
      <div className="w-40 flex flex-col justify-center items-start p-2 border-r bg-muted/50">
        <div className="flex items-center gap-2">
          {typeIcons[type]}
          <span className="font-medium text-sm truncate">{label}</span>
        </div>
      </div>
      <div className="flex-1 relative bg-muted/20">
        {clips.map((clip, index) => (
          <div
            key={index}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-16 rounded-md flex items-center justify-between px-2 cursor-pointer group transition-all duration-200 hover:h-[72px] hover:-translate-y-[36px]",
              clip.color
            )}
            style={{
              left: `${clip.start}%`,
              width: `${clip.end - clip.start}%`,
            }}
          >
            <GripVertical className="w-5 h-5 text-white/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            <GripVertical className="w-5 h-5 text-white/50 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
