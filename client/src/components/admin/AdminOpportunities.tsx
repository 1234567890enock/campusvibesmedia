import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminOpportunities() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "other" as "scholarship" | "event" | "announcement" | "other",
    imageUrl: "",
    link: "",
    deadline: "",
    status: "active" as "active" | "inactive",
  });

  const opportunitiesQuery = trpc.opportunities.adminList.useQuery();
  const createMutation = trpc.opportunities.create.useMutation();
  const deleteMutation = trpc.opportunities.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      });
      toast.success("Opportunity created successfully");
      setFormData({
        title: "",
        slug: "",
        description: "",
        type: "other",
        imageUrl: "",
        link: "",
        deadline: "",
        status: "active",
      });
      setIsCreating(false);
      opportunitiesQuery.refetch();
    } catch (error) {
      toast.error("Failed to create opportunity");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Opportunity deleted successfully");
      opportunitiesQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete opportunity");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Opportunity</CardTitle>
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
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <Input
                  placeholder="Link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>

              <Input
                placeholder="Deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Opportunity
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
        <Button onClick={() => setIsCreating(true)}>Create New Opportunity</Button>
      )}

      {/* Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunities</CardTitle>
          <CardDescription>Manage all opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          {opportunitiesQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !opportunitiesQuery.data || opportunitiesQuery.data.length === 0 ? (
            <p className="text-muted-foreground">No opportunities yet</p>
          ) : (
            <div className="space-y-2">
              {opportunitiesQuery.data.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{opp.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Type: <span className="capitalize">{opp.type}</span> • Status: <span className="capitalize">{opp.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(opp.id)}
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
