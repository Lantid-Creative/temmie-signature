import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-3">
            Browse Categories
          </p>
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}
