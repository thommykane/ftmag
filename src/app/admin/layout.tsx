import { VideoBackground } from "@/components/VideoBackground";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
