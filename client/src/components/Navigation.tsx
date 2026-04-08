import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X, LogOut } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/videos", label: "Videos" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/team", label: "Team" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 font-bold text-lg text-gradient cursor-pointer">
              <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white font-bold">
                CV
              </div>
              <span className="hidden sm:inline">Campus Vibes</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "bg-accent text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side - Auth & Admin */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <div>
                      <Button variant="outline" size="sm">
                        Admin Panel
                      </Button>
                    </div>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">Sign In</Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    isActive(link.href)
                      ? "bg-accent text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <div
                        className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4 mr-2 inline" />
                    Logout
                  </button>
                </>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button className="w-full" size="sm">
                    Sign In
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
