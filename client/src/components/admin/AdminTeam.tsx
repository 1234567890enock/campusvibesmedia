import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminTeam() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    email: "",
    socialLinks: "",
    displayOrder: "0",
  });

  const teamQuery = trpc.team.list.useQuery();
  const createMutation = trpc.team.create.useMutation();
  const deleteMutation = trpc.team.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        displayOrder: parseInt(formData.displayOrder),
        socialLinks: formData.socialLinks ? formData.socialLinks : undefined,
      });
      toast.success("Team member created successfully");
      setFormData({
        name: "",
        role: "",
        bio: "",
        imageUrl: "",
        email: "",
        socialLinks: "",
        displayOrder: "0",
      });
      setIsCreating(false);
      teamQuery.refetch();
    } catch (error) {
      toast.error("Failed to create team member");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Team member deleted successfully");
      teamQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete team member");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <Textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Social Links (JSON format)"
                  value={formData.socialLinks}
                  onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                />
                <Input
                  placeholder="Display Order"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Team Member
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
        <Button onClick={() => setIsCreating(true)}>Add Team Member</Button>
      )}

      {/* Team List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage team members</CardDescription>
        </CardHeader>
        <CardContent>
          {teamQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !teamQuery.data || teamQuery.data.length === 0 ? (
            <p className="text-muted-foreground">No team members yet</p>
          ) : (
            <div className="space-y-2">
              {teamQuery.data.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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
