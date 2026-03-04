import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PageMeta } from '@/components/seo/PageMeta';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { useBlogPosts } from '@/hooks/useBlog';
import { format } from 'date-fns';

export default function Blog() {
  const { data: posts, isLoading } = useBlogPosts(true);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Blog — Hair Care Tips & Trends | Trazzie" description="Hair care tips, styling guides, and the latest trends in wigs and beauty from the Trazzie team." />
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog' }]} />

          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold mb-4">
              Our Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hair care tips, styling guides, and the latest trends in the world of wigs and beauty.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No blog posts yet. Check back soon!</p>
              <Link to="/shop" className="text-primary hover:underline">
                Browse our shop instead →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  {post.featured_image ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                      <span className="text-4xl">✍️</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt || post.content?.slice(0, 150)}
                    </p>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
