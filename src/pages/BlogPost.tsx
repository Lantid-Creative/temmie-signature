import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlogPost } from '@/hooks/useBlog';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">Post not found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />

          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                </span>
                {post.author_name && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {post.author_name}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl lg:text-5xl font-semibold leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground mt-4">{post.excerpt}</p>
              )}
            </header>

            {post.featured_image && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-foreground">
              {post.content?.split('\n').map((paragraph, i) => (
                paragraph.trim() ? <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p> : null
              ))}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
