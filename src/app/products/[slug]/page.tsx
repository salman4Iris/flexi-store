'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { notFound, useParams } from 'next/navigation';
import { useProduct } from '@/features/products/hooks/useProduct';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import RecommendedProducts from '@/features/products/components/RecommendedProducts';

const ProductDetails = dynamic(
  () => import('@/features/products/components/ProductDetails').then((module) => module.ProductDetails),
);

const ProductDetailPage = (): React.ReactElement => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string || '');
  const productSlug = slug || '__missing__';
  const { product, loading, error } = useProduct(productSlug);

  if (!slug) {
    return notFound();
  }

  if (loading) {
    return (
      <Container>
        <Section>
          <div className="flex justify-center items-center h-96">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="h-8 bg-(--color-text) bg-opacity-10 rounded w-48 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-(--color-text) bg-opacity-10 rounded w-96 mx-auto"></div>
                  <div className="h-4 bg-(--color-text) bg-opacity-10 rounded w-96 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (!product || error) {
    return notFound();
  }

  return (
    <Container>
      <Section>
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </div>

        {/* Product Content */}
        <ProductDetails product={product} />

        {/* Related Products Section */}
        <div className="mt-16 pt-8 border-t border-(--color-text) border-opacity-10">
          <RecommendedProducts
            currentProductId={product.id}
            category={product.category}
            limit={4}
          />
        </div>
      </Section>
    </Container>
  );
};

export default ProductDetailPage;
