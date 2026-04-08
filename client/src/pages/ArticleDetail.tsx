import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { Streamdown } from "streamdown";

export default function ArticleDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const articleQuery = trpc.articles.getBySlug.useQuery({ slug });

  if (articleQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!articleQuery.data) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/news">
            <Button>Back to News</Button>
          </Link>
        </div>
      </div>
    );
  }

  const article = articleQuery.data;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Back Button */}
        <Link href="/news">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>

        {/* Article Header */}
        <article className="fade-in">
          {article.thumbnailUrl && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-purple-300 to-blue-300">
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

          {/* Article Meta */}
          <div className="flex flex-wrap gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unpublished"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Campus Vibes Media</span>
            </div>
            {article.viewCount && (
              <div className="flex items-center gap-2">
                <span>{article.viewCount} views</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 italic">{article.excerpt}</p>
          )}

          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none mb-12">
            <Streamdown>{article.content}</Streamdown>
          </div>

          {/* Related Articles Section */}
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold mb-6">More from Campus Vibes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Placeholder for related articles */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Discover More</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out other stories from our campus community.
                  </p>
                  <Link href="/news">
                    <Button variant="outline" size="sm">
                      Browse All Articles
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
