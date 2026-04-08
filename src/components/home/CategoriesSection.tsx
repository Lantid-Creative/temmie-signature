import { Link } from 'react-router-dom';
import { categories as fallbackCategories } from '@/lib/data';
import { useCategories } from '@/hooks/useProducts';
import { SectionReveal } from '@/components/home/SectionReveal';

export function CategoriesSection() {
  const { data: dbCategories } = useCategories();

  const categories = dbCategories?.length
    ? dbCategories.filter(c => c.is_active).map(c => ({
        id: c.slug,
        name: c.name,
        image: c.image_url || '',
      }))
    : fallbackCategories;

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionReveal className="text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            Browse Categories
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold">
            Shop by Category
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <SectionReveal key={category.id} delay={index * 0.06}>
              <Link
                to={`/shop?category=${category.id}`}
                className="group text-center"
              >
                <div className="aspect-square rounded-full overflow-hidden mb-4 border-2 border-border group-hover:border-accent transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-serif text-lg font-semibold group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
