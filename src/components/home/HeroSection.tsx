import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    title: 'Adedotun',
    subtitle: 'Revel in the regal allure of traditional Nigerian styles',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/5.png',
    link: '/shop?collection=adedotun',
  },
  {
    title: 'TMS GM01',
    subtitle: 'Make your Wedding Day Memorable',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/2.png',
    link: '/shop?collection=tms-gm01',
  },
  {
    title: 'Urban Safari',
    subtitle: 'Conquer the street with Afro inspired modern casual wears',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/DSC03812.jpg',
    link: '/shop?collection=urban-safari',
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-secondary">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === current ? 'opacity-100' : 'opacity-0'
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 lg:py-0 relative z-10">
        <div className="max-w-xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                'transition-all duration-700',
                index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'
              )}
            >
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 text-background">
                {slide.title}
              </h1>
              <p className="text-lg lg:text-xl text-background/80 max-w-lg mb-8">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-base font-medium group"
                asChild
              >
                <Link to={slide.link}>
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === current ? 'w-8 bg-accent' : 'w-2 bg-background/50'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
