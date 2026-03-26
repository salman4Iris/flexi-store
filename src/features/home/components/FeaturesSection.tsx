'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const features: Feature[] = [
  {
    id: 'free-shipping',
    title: 'Free Shipping',
    description: 'Enjoy free shipping on orders over ₹500. Fast and reliable delivery to your doorstep.',
    icon: '🚚',
  },
  {
    id: 'secure-payment',
    title: 'Secure Payment',
    description: 'Your transactions are protected with industry-leading encryption and security protocols.',
    icon: '🔒',
  },
  {
    id: 'easy-returns',
    title: 'Easy Returns',
    description: '30-day hassle-free returns. If you are not satisfied, we will make it right.',
    icon: '↩️',
  },
  {
    id: 'customer-support',
    title: '24/7 Support',
    description: 'Our dedicated support team is available 24/7 to help with any questions or concerns.',
    icon: '💬',
  },
  {
    id: 'authentic-products',
    title: 'Authentic Products',
    description: '100% authentic products from verified sellers and trusted brands.',
    icon: '✅',
  },
  {
    id: 'best-prices',
    title: 'Best Prices',
    description: 'We offer competitive prices and regular deals to give you the best value for money.',
    icon: '💰',
  },
];

function FeaturesSection(): React.ReactNode {
  return (
    <section className="py-12 bg-gray-50 rounded-lg">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Shop With Us</h2>
        <p className="text-lg text-gray-600">Experience shopping like never before with our premium features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="pt-6">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
