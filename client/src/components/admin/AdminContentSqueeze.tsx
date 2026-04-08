import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminContentSqueeze() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    type: "trending" as "trending" | "highlight" | "featured",
    status: "active" as "active" | "inactive",
    displayOrder: "0",
  });

  const contentQuery = trpc.contentSqueeze.adminList.useQuery();
  const createMutation = trpc.contentSqueeze.create.useMutation();
  const deleteMutation = trpc.contentSqueeze.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        displayOrder: parseInt(formData.displayOrder),
      });
      toast.success("Content squeeze created successfully");
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        type: "trending",
        status: "active",
        displayOrder: "0",
      });
      setIsCreating(false);
      contentQuery.refetch();
    } catch (error) {
      toast.error("Failed to create content squeeze");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Content deleted successfully");
      contentQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Content Squeeze</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="highlight">Highlight</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Content
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
        <Button onClick={() => setIsCreating(true)}>Create Content Squeeze</Button>
      )}

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Squeeze</CardTitle>
          <CardDescription>Manage trending and highlighted content</CardDescription>
        </CardHeader>
        <CardContent>
          {contentQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !contentQuery.data || contentQuery.data.length === 0 ? (
            <p className="text-muted-foreground">No content squeeze yet</p>
          ) : (
            <div className="space-y-2">
              {contentQuery.data.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: <span className="capitalize">{content.type}</span> • Status: <span className="capitalize">{content.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(content.id)}
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
