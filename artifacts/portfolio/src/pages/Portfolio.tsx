import { useEffect, useState } from "react";
import { useListPortfolio } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github, Folder } from "lucide-react";
import { PortfolioProject } from "@workspace/api-client-react";

export default function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const { data: projects, isLoading } = useListPortfolio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["All", ...Array.from(new Set((projects || []).map(p => p.category)))];

  const filteredProjects = projects?.filter(p => filter === "All" || p.category === filter).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  }) || [];

  return (
    <div className="container max-w-6xl mx-auto py-12 md:py-20 px-4">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Selected <span className="text-primary">Works</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A showcase of my recent projects, demonstrating my approach to solving complex problems with clean, maintainable code.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-card/50 border-border/50 h-[400px]">
              <CardHeader className="p-0">
                <Skeleton className="h-48 w-full rounded-t-xl rounded-b-none" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-border">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground">There are currently no projects matching this category.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: PortfolioProject) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`h-full flex flex-col overflow-hidden group border-border/50 bg-card/30 hover:bg-card transition-colors duration-300 ${project.featured ? 'ring-1 ring-primary/30' : ''}`}>
                      {project.imageUrl ? (
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {project.featured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 bg-secondary/50 flex items-center justify-center relative">
                          <Folder className="h-12 w-12 text-muted-foreground opacity-20" />
                          {project.featured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <CardContent className="flex-1 p-6">
                        <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{project.category}</div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.technologies?.slice(0, 4).map(tech => (
                            <span key={tech} className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                              {tech}
                            </span>
                          ))}
                          {(project.technologies?.length || 0) > 4 && (
                            <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0 flex gap-3 border-t border-border/10 mt-4 pb-4">
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noreferrer">
                              <Github className="mr-2 h-4 w-4" /> Source
                            </a>
                          </Button>
                        )}
                        {project.demoUrl && (
                          <Button size="sm" className="w-full" asChild>
                            <a href={project.demoUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
