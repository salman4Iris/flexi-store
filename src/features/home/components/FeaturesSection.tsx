'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { StoreFeature } from '@/features/home/types';

interface FeaturesSectionProps {
  features: StoreFeature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="py-12 bg-(--color-bg) rounded-lg border border-(--color-text) border-opacity-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-(--color-text) mb-4">Why Shop With Us</h2>
        <p className="text-lg text-(--color-text) opacity-75">Experience shopping like never before with our premium features</p>
      </div>

      {features.length === 0 && (
        <p className="text-center text-(--color-text) opacity-75">
          No features available
        </p>
      )}

      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="pt-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-(--color-text) mb-2">{feature.title}</h3>
                <p className="text-(--color-text) opacity-75">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturesSection;
