import React from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  alt: string;
  badge?: string;
  href: string;
}

const products: Product[] = [
{
  id: "prod_deluxe",
  name: "Deluxe Chocolate Hamper",
  price: 2499,
  originalPrice: 2999,
  rating: 4.8,
  reviews: 234,
  image:
  "https://images.unsplash.com/photo-1569442130148-5dd96b7e4ec9",
  alt: "Deluxe gift hamper with assorted premium chocolates, decorative box with ribbon",
  badge: "Best Seller",
  href: "/product-detail"
},
{
  id: "prod_wellness",
  name: "Wellness Spa Collection",
  price: 1899,
  rating: 4.9,
  reviews: 189,
  image:
  "https://images.unsplash.com/photo-1630893173621-33f717488924",
  alt: "Spa gift set with candles, bath bombs, essential oils in wicker basket",
  badge: "New",
  href: "/product-detail"
},
{
  id: "prod_gourmet",
  name: "Gourmet Snack Box",
  price: 1599,
  rating: 4.7,
  reviews: 156,
  image:
  "https://img.rocket.new/generatedImages/rocket_gen_img_14b7f6a24-1767204777625.png",
  alt: "Gourmet snack gift box with crackers, cheese, nuts, and wine",
  href: "/product-detail"
},
{
  id: "prod_birthday",
  name: "Birthday Celebration Box",
  price: 1299,
  originalPrice: 1599,
  rating: 4.6,
  reviews: 203,
  image:
  "https://images.unsplash.com/photo-1602158969648-fe68a35581fa",
  alt: "Birthday gift box with balloons, confetti, chocolates, and greeting card",
  badge: "Sale",
  href: "/product-detail"
},
{
  id: "prod_tea",
  name: "Premium Tea Collection",
  price: 999,
  rating: 4.5,
  reviews: 98,
  image:
  "https://img.rocket.new/generatedImages/rocket_gen_img_1671ad495-1766880080349.png",
  alt: "Premium tea gift set with assorted tea varieties, teapot, and cups",
  href: "/product-detail"
},
{
  id: "prod_baby",
  name: "New Baby Joy Hamper",
  price: 2199,
  rating: 4.9,
  reviews: 167,
  image:
  "https://images.unsplash.com/photo-1635874714425-c342060a4c58",
  alt: "Baby gift hamper with soft toys, baby clothes, blanket in pastel colors",
  badge: "Trending",
  href: "/product-detail"
}];


const BestSellers: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-2 block">
            Customer Favorites
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Best Selling Hampers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked by thousands of happy customers
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Featured Card (First Item) */}
          <div className="md:col-span-2 md:row-span-2">
            <Link
              href={products[0].href}
              className="group relative block h-full bg-background border border-border rounded-3xl overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300">

              {/* Badge */}
              {products[0].badge &&
              <div className="absolute top-4 left-4 z-20">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {products[0].badge}
                  </span>
                </div>
              }

              {/* Wishlist Button */}
              <button
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Add to wishlist">

                <Icon name="HeartIcon" size={20} />
              </button>

              {/* Image */}
              <div className="relative h-96 overflow-hidden">
                <AppImage
                  src={products[0].image}
                  alt={products[0].alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {products[0].name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) =>
                    <Icon
                      key={`star_${i}`}
                      name="StarIcon"
                      size={16}
                      variant={i < Math.floor(products[0].rating) ? "solid" : "outline"}
                      className="text-yellow-500" />

                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {products[0].rating} ({products[0].reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-serif text-2xl text-foreground">
                    ₹{products[0].price}
                  </span>
                  {products[0].originalPrice &&
                  <span className="text-muted-foreground line-through">
                      ₹{products[0].originalPrice}
                    </span>
                  }
                </div>

                {/* Add to Cart Button */}
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  Add to Cart
                </button>
              </div>
            </Link>
          </div>

          {/* Smaller Cards (Remaining Items) */}
          {products.slice(1).map((product) =>
          <Link
            key={product.id}
            href={product.href}
            className="group relative block bg-background border border-border rounded-3xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300">

              {/* Badge */}
              {product.badge &&
            <div className="absolute top-3 left-3 z-20">
                  <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.badge === "New" ? "bg-success text-success-foreground" :
                product.badge === "Sale" ? "bg-error text-error-foreground" :
                product.badge === "Trending" ? "bg-warning text-warning-foreground" : "bg-primary text-primary-foreground"}`
                }>

                    {product.badge}
                  </span>
                </div>
            }

              {/* Wishlist Button */}
              <button
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Add to wishlist">

                <Icon name="HeartIcon" size={16} />
              </button>

              {/* Image */}
              <div className="relative h-48 overflow-hidden mask-arch">
                <AppImage
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Icon
                  name="StarIcon"
                  size={14}
                  variant="solid"
                  className="text-yellow-500" />

                  <span className="text-sm text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-foreground">
                    ₹{product.price}
                  </span>
                  {product.originalPrice &&
                <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                }
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">

            View All Products
            <Icon name="ArrowRightIcon" size={18} />
          </Link>
        </div>
      </div>
    </section>);

};

export default BestSellers;