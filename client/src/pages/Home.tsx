import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Play, Zap, Users, Trophy, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const articlesQuery = trpc.articles.list.useQuery({ limit: 3 });
  const videosQuery = trpc.videos.list.useQuery({ limit: 3 });
  const opportunitiesQuery = trpc.opportunities.list.useQuery({ limit: 3 });
  const contentSqueezeQuery = trpc.contentSqueeze.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="brand-gradient text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 fade-in">Campus Vibes Media</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 fade-in">
            Your gateway to campus news, stories, and opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Link href="/news">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore News <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/videos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                Watch Videos <Play className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Squeeze Section */}
      {contentSqueezeQuery.data && contentSqueezeQuery.data.length > 0 && (
        <section className="py-12 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contentSqueezeQuery.data.slice(0, 3).map((item) => (
                <Card key={item.id} className="card-hover overflow-hidden">
                  {item.imageUrl && (
                    <div className="h-40 bg-gradient-to-br from-purple-400 to-blue-400 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {articlesQuery.data && articlesQuery.data.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Latest News</h2>
              <Link href="/news">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articlesQuery.data.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="card-hover overflow-hidden cursor-pointer h-full">
                    {article.thumbnailUrl && (
                      <div className="h-48 bg-gradient-to-br from-purple-300 to-blue-300 overflow-hidden">
                        <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos */}
      {videosQuery.data && videosQuery.data.length > 0 && (
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Videos</h2>
              <Link href="/videos">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videosQuery.data.map((video) => (
                <Link key={video.id} href={`/video/${video.slug}`}>
                  <Card className="card-hover overflow-hidden cursor-pointer h-full">
                    <div className="relative h-48 bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <Play className="h-12 w-12 text-white" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Opportunities */}
      {opportunitiesQuery.data && opportunitiesQuery.data.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Opportunities</h2>
              <Link href="/opportunities">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunitiesQuery.data.slice(0, 3).map((opp) => (
                <Card key={opp.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">{opp.title}</CardTitle>
                        <CardDescription className="capitalize mt-1">{opp.type}</CardDescription>
                      </div>
                      <Trophy className="h-5 w-5 text-accent ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{opp.description}</p>
                    {opp.deadline && (
                      <p className="text-xs text-accent font-semibold">
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Campus Vibes Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay updated with the latest campus news, videos, and opportunities. Never miss a beat from your campus community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/team">
              <Button size="lg" variant="outline">
                Meet Our Team <Users className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button size="lg" className="brand-gradient-hover text-white border-0">
                Explore Opportunities <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Panel Link */}
      {isAuthenticated && user?.role === 'admin' && (
        <section className="py-8 px-4 border-t border-border">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-4">You are logged in as an administrator</p>
            <Link href="/admin">
              <Button>Go to Admin Panel</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
