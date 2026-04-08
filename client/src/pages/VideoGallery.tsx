import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Play } from "lucide-react";

export default function VideoGallery() {
  const [page, setPage] = useState(0);
  const videosQuery = trpc.videos.list.useQuery({
    limit: 12,
    offset: page * 12,
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Video Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Watch the latest campus videos and multimedia content
          </p>
        </div>

        {/* Videos Grid */}
        {videosQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : !videosQuery.data || videosQuery.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No videos available yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {videosQuery.data.map((video) => (
                <Link key={video.id} href={`/video/${video.slug}`}>
                  <Card className="card-hover overflow-hidden cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 bg-gradient-to-br from-purple-300 to-blue-300 overflow-hidden group">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                        </div>
                      )}
                    </div>
                    <CardHeader className="flex-1">
                      <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span>{video.viewCount || 0} views</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!videosQuery.data || videosQuery.data.length < 12}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
