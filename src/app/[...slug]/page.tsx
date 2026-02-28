import { supabaseServer } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function ProductPage({ params }: PageProps) {
  // Correct way — await params first
  const { slug } = await params;

  const productSlug = slug[slug.length - 1];

  const supabase = await supabaseServer();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .single();

  if (!product) return <div>Not found</div>;

  return <div>{product.name}</div>;
}
