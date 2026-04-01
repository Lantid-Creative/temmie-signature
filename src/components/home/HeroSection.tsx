import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

const fallbackSlides = [
  {
    title: 'TMS GM01',
    subtitle: 'Make your Wedding Day Memorable',
    cta: 'Shop Collection',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/2.png',
    link: '/shop?collection=tms-gm01',
  },
  {
    title: 'Adedotun',
    subtitle: 'Revel in the regal allure of traditional Nigerian styles',
    cta: 'Explore Now',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/5.png',
    link: '/shop?collection=adedotun',
  },
  {
    title: 'Urban Safari',
    subtitle: 'Conquer the street with Afro inspired modern casual wears',
    cta: 'Discover More',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/DSC03812.jpg',
    link: '/shop?collection=urban-safari',
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { data: banners } = useBanners('hero');

  const slides = banners?.length
    ? banners.map((banner) => ({
        title: banner.title,
        subtitle: banner.subtitle || banner.description || '',
        cta: banner.button_text || 'Shop Now',
        image: banner.mobile_image_url || banner.image_url,
        link: banner.link_url || '/shop',
      }))
    : fallbackSlides;

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  const goTo = (idx: number) => setCurrent((idx + slides.length) % slides.length);

  return (
    <section className="relative h-[100svh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all duration-[1.2s] ease-in-out',
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/40 to-foreground/10" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                'transition-all duration-700',
                index === current
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 absolute pointer-events-none'
              )}
            >
              <span className="inline-block text-accent text-sm font-medium tracking-[0.2em] uppercase mb-4">
                New Collection
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] mb-6 text-background">
                {slide.title}
              </h1>
              <p className="text-lg lg:text-xl text-background/75 max-w-md mb-10 leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 text-sm font-semibold tracking-wide uppercase rounded-full group"
                  asChild
                >
                  <Link to={slide.link}>
                    {slide.cta}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-sm font-semibold tracking-wide uppercase rounded-full border-2 border-background/40 text-background bg-transparent hover:bg-background/15 hover:border-background/60"
                  asChild
                >
                  <Link to="/shop">View All</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-8 lg:right-16 z-10 flex items-center gap-3">
        <button
          onClick={() => goTo(current - 1)}
          className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center text-background/70 hover:bg-background/10 hover:text-background transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center text-background/70 hover:bg-background/10 hover:text-background transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-12 left-8 lg:left-16 z-10 flex items-center gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group flex items-center gap-2"
          >
            <div
              className={cn(
                'h-[2px] transition-all duration-500',
                index === current ? 'w-10 bg-accent' : 'w-5 bg-background/30 group-hover:bg-background/50'
              )}
            />
          </button>
        ))}
        <span className="text-background/50 text-sm font-medium ml-2">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
