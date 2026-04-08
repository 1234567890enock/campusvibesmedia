import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, ExternalLink, Trophy, Zap, Users, BookOpen } from "lucide-react";

const opportunityTypeConfig = {
  scholarship: { icon: Trophy, color: "bg-yellow-100 text-yellow-800", label: "Scholarship" },
  event: { icon: Users, color: "bg-blue-100 text-blue-800", label: "Event" },
  announcement: { icon: Zap, color: "bg-purple-100 text-purple-800", label: "Announcement" },
  other: { icon: BookOpen, color: "bg-gray-100 text-gray-800", label: "Other" },
};

export default function Opportunities() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const opportunitiesQuery = trpc.opportunities.list.useQuery({
    limit: 12,
    offset: page * 12,
  });

  const filteredOpportunities = selectedType
    ? opportunitiesQuery.data?.filter((o) => o.type === selectedType) || []
    : opportunitiesQuery.data || [];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Opportunities</h1>
          <p className="text-lg text-muted-foreground">
            Discover scholarships, events, and announcements for your campus journey
          </p>
        </div>

        {/* Type Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => setSelectedType(null)}
            className="rounded-full"
          >
            All Opportunities
          </Button>
          {Object.entries(opportunityTypeConfig).map(([type, config]) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="rounded-full"
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {opportunitiesQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No opportunities found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {filteredOpportunities.map((opp) => {
                const typeConfig = opportunityTypeConfig[opp.type as keyof typeof opportunityTypeConfig];
                const IconComponent = typeConfig?.icon || BookOpen;

                return (
                  <Card key={opp.id} className="card-hover overflow-hidden flex flex-col">
                    {opp.imageUrl && (
                      <div className="h-40 bg-gradient-to-br from-purple-300 to-blue-300 overflow-hidden">
                        <img
                          src={opp.imageUrl}
                          alt={opp.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="line-clamp-2">{opp.title}</CardTitle>
                        <IconComponent className="h-5 w-5 text-accent flex-shrink-0" />
                      </div>
                      <Badge className={`w-fit ${typeConfig?.color || "bg-gray-100 text-gray-800"}`}>
                        {typeConfig?.label || "Other"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">{opp.description}</p>

                      {opp.deadline && (
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Deadline: {new Date(opp.deadline).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      {opp.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(opp.link || "", "_blank")}
                        >
                          Learn More <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
                disabled={!opportunitiesQuery.data || opportunitiesQuery.data.length < 12}
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
