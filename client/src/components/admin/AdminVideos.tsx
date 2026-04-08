import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminVideos() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    status: "draft" as "draft" | "published",
  });

  const videosQuery = trpc.videos.adminList.useQuery();
  const createMutation = trpc.videos.create.useMutation();
  const deleteMutation = trpc.videos.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.videoUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      });
      toast.success("Video created successfully");
      setFormData({
        title: "",
        slug: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "",
        status: "draft",
      });
      setIsCreating(false);
      videosQuery.refetch();
    } catch (error) {
      toast.error("Failed to create video");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Video deleted successfully");
      videosQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Video URL (YouTube or direct link)"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  required
                />
                <Input
                  placeholder="Thumbnail URL"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Duration (seconds)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "draft" | "published" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Video
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      {!isCreating && (
        <Button onClick={() => setIsCreating(true)}>Create New Video</Button>
      )}

      {/* Videos List */}
      <Card>
        <CardHeader>
          <CardTitle>Videos</CardTitle>
          <CardDescription>Manage all videos</CardDescription>
        </CardHeader>
        <CardContent>
          {videosQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !videosQuery.data || videosQuery.data.length === 0 ? (
            <p className="text-muted-foreground">No videos yet</p>
          ) : (
            <div className="space-y-2">
              {videosQuery.data.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="capitalize">{video.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
