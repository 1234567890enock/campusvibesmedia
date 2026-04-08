import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Calendar } from "lucide-react";

export default function NewsFeed() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const categoriesQuery = trpc.categories.list.useQuery();
  const articlesQuery = trpc.articles.list.useQuery({
    limit: 12,
    offset: page * 12,
  });

  const filteredArticles = selectedCategoryId
    ? articlesQuery.data?.filter((a) => a.categoryId === selectedCategoryId) || []
    : articlesQuery.data || [];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Campus News</h1>
          <p className="text-lg text-muted-foreground">
            Stay informed with the latest stories from our campus community
          </p>
        </div>

        {/* Category Filter */}
        {categoriesQuery.data && categoriesQuery.data.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(null)}
              className="rounded-full"
            >
              All Articles
            </Button>
            {categoriesQuery.data.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {articlesQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No articles found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="card-hover overflow-hidden cursor-pointer h-full flex flex-col">
                    {article.thumbnailUrl && (
                      <div className="h-48 bg-gradient-to-br from-purple-300 to-blue-300 overflow-hidden">
                        <img
                          src={article.thumbnailUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <Calendar className="h-3 w-3" />
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : "Unpublished"}
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
                disabled={filteredArticles.length < 12}
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
