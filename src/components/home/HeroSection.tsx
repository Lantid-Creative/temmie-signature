import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

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
  const activeSlide = slides[current];

  return (
    <section className="relative flex h-[100svh] min-h-[600px] items-center overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,hsl(var(--accent)/0.28),transparent_26%),radial-gradient(circle_at_82%_18%,hsl(var(--background)/0.12),transparent_22%),linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--brand-red-dark))_55%,hsl(var(--primary))_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/80 to-transparent" />

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
            className={cn(
              'w-full h-full object-cover',
              !reduceMotion && index === current && 'scale-[1.03] transition-transform duration-[6000ms] ease-out'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/88 via-foreground/50 to-foreground/12" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.55fr)]">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.title}-${current}`}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-background/20 bg-background/10 px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_hsl(var(--accent)/0.8)]" />
                  <span className="text-xs font-medium uppercase tracking-[0.28em] text-background/85">
                    Temmie Signature Collection
                  </span>
                </div>

                <h1 className="font-serif text-5xl font-bold leading-[0.9] text-background sm:text-6xl lg:text-7xl xl:text-8xl">
                  {activeSlide.title}
                </h1>

                <div className="mt-6 h-px w-28 bg-gradient-to-r from-accent via-background/70 to-transparent" />

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/78 lg:text-xl">
                  {activeSlide.subtitle}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="group h-14 rounded-full bg-accent px-10 text-sm font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_20px_60px_hsl(var(--accent)/0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
                    asChild
                  >
                    <Link to={activeSlide.link}>
                      {activeSlide.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-full border-2 border-background/35 bg-background/8 px-10 text-sm font-semibold uppercase tracking-[0.18em] text-background backdrop-blur-sm hover:border-background/60 hover:bg-background/15"
                    asChild
                  >
                    <Link to="/shop">View All</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="rounded-[2rem] border border-background/15 bg-background/8 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-background/55">Now Showing</p>
              <p className="mt-4 font-serif text-3xl font-semibold text-background">{activeSlide.title}</p>
              <p className="mt-3 text-sm leading-7 text-background/68">Luxury menswear, ceremonial silhouettes, and refined modern tailoring curated for standout entrances.</p>
              <div className="mt-8 flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title + index}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      index === current ? 'w-14 bg-accent' : 'w-8 bg-background/25 hover:bg-background/45'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-12 right-8 lg:right-16 z-10 flex items-center gap-3">
        <button
          onClick={() => goTo(current - 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-background/30 bg-background/8 text-background/70 backdrop-blur-md transition-colors hover:bg-background/15 hover:text-background"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-background/30 bg-background/8 text-background/70 backdrop-blur-md transition-colors hover:bg-background/15 hover:text-background"
          aria-label="Next slide"
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
            aria-label={`Go to slide ${index + 1}`}
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
