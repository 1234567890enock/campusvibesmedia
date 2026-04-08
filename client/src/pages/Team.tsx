import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, Linkedin, Twitter } from "lucide-react";

export default function Team() {
  const teamQuery = trpc.team.list.useQuery();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate individuals behind Campus Vibes Media, dedicated to bringing you the best campus stories
          </p>
        </div>

        {/* Team Grid */}
        {teamQuery.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : !teamQuery.data || teamQuery.data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">Team members coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamQuery.data.map((member) => {
              let socialLinks: Record<string, string> = {};
              try {
                if (member.socialLinks) {
                  socialLinks = JSON.parse(member.socialLinks);
                }
              } catch (e) {
                // Ignore parsing errors
              }

              return (
                <Card key={member.id} className="card-hover overflow-hidden flex flex-col">
                  {member.imageUrl && (
                    <div className="h-64 bg-gradient-to-br from-purple-300 to-blue-300 overflow-hidden">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-accent font-semibold">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                    )}

                    {/* Contact & Social Links */}
                    <div className="flex gap-2 flex-wrap">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-white transition-colors"
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-white transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a
                          href={socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-white transition-colors"
                          title="Twitter"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
