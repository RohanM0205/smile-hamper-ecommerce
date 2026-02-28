import React from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  alt: string;
  href: string;
}

const relatedProducts: RelatedProduct[] = [
{
  id: "rel_1",
  name: "Premium Truffle Collection",
  price: 1899,
  rating: 4.8,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1016b20bf-1768229830156.png",
  alt: "Premium truffle collection in elegant gift box with ribbon",
  href: "/product-detail"
},
{
  id: "rel_2",
  name: "Chocolate & Wine Pairing",
  price: 3499,
  rating: 4.9,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1695808f3-1768767633028.png",
  alt: "Luxury chocolate and wine gift set with gourmet pairings",
  href: "/product-detail"
},
{
  id: "rel_3",
  name: "Artisan Chocolate Box",
  price: 1599,
  rating: 4.7,
  image: "https://images.unsplash.com/photo-1687514852944-92879f9abc0f",
  alt: "Artisan handcrafted chocolate assortment in decorative box",
  href: "/product-detail"
},
{
  id: "rel_4",
  name: "Chocolate Lover's Dream",
  price: 2299,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1694796446470-71f9874f73ed",
  alt: "Large chocolate hamper with variety of chocolate types and flavors",
  href: "/product-detail"
}];


const RelatedProducts: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) =>
          <Link
            key={product.id}
            href={product.href}
            className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300">

              <div className="relative h-48 overflow-hidden bg-muted">
                <AppImage
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Icon
                  name="StarIcon"
                  size={14}
                  variant="solid"
                  className="text-yellow-500" />

                  <span className="text-sm text-foreground">{product.rating}</span>
                </div>
                <div className="font-serif text-lg text-foreground">
                  ₹{product.price}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

};

export default RelatedProducts;