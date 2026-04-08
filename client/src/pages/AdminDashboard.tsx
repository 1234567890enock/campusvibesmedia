import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminVideos from "@/components/admin/AdminVideos";
import AdminOpportunities from "@/components/admin/AdminOpportunities";
import AdminTeam from "@/components/admin/AdminTeam";
import AdminContentSqueeze from "@/components/admin/AdminContentSqueeze";
import AdminCategories from "@/components/admin/AdminCategories";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all Campus Vibes Media content</p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="squeeze">Squeeze</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <AdminArticles />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideos />
          </TabsContent>

          <TabsContent value="opportunities">
            <AdminOpportunities />
          </TabsContent>

          <TabsContent value="team">
            <AdminTeam />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>

          <TabsContent value="squeeze">
            <AdminContentSqueeze />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
