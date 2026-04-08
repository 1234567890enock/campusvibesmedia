import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Play } from "lucide-react";
import { Streamdown } from "streamdown";

export default function VideoDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const videoQuery = trpc.videos.getBySlug.useQuery({ slug });

  if (videoQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!videoQuery.data) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Video Not Found</h1>
          <p className="text-muted-foreground mb-6">The video you're looking for doesn't exist.</p>
          <Link href="/videos">
            <Button>Back to Videos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const video = videoQuery.data;

  // Determine if URL is YouTube or other video source
  const isYouTube = video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be");
  const youtubeId = isYouTube
    ? video.videoUrl.includes("youtube.com")
      ? new URL(video.videoUrl).searchParams.get("v")
      : video.videoUrl.split("/").pop()
    : null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href="/videos">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </Link>

        {/* Video Player */}
        <div className="mb-8 rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center fade-in">
          {youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : video.videoUrl.startsWith("http") ? (
            <video
              width="100%"
              height="100%"
              controls
              className="w-full h-full"
              poster={video.thumbnailUrl || undefined}
            >
              <source src={video.videoUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-white gap-4">
              <Play className="h-16 w-16" />
              <p>Video player unavailable</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <article className="fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{video.title}</h1>

          {/* Video Meta */}
          <div className="flex flex-wrap gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <span>{video.viewCount || 0} views</span>
            </div>
            {video.duration && (
              <div className="flex items-center gap-2">
                <span>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {video.description && (
            <div className="prose prose-sm md:prose-base max-w-none mb-12">
              <Streamdown>{video.description}</Streamdown>
            </div>
          )}

          {/* Related Videos Section */}
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold mb-6">More Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related videos */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Discover More</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out other videos from our campus community.
                  </p>
                  <Link href="/videos">
                    <Button variant="outline" size="sm">
                      Browse All Videos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
