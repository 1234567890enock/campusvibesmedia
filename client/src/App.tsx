import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NewsFeed from "./pages/NewsFeed";
import ArticleDetail from "./pages/ArticleDetail";
import VideoGallery from "./pages/VideoGallery";
import VideoDetail from "./pages/VideoDetail";
import Opportunities from "./pages/Opportunities";
import Team from "./pages/Team";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./components/Navigation";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/news"} component={NewsFeed} />
      <Route path={"/article/:slug"} component={ArticleDetail} />
      <Route path={"/videos"} component={VideoGallery} />
      <Route path={"/video/:slug"} component={VideoDetail} />
      <Route path={"/opportunities"} component={Opportunities} />
      <Route path={"/team"} component={Team} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
