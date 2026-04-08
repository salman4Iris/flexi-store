'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const NewsletterSection = (): React.ReactNode => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { message: string };

      if (!response.ok) {
        setError(payload.message ?? 'Failed to subscribe. Please try again.');
        return;
      }

      setSuccess(true);
      setEmail('');

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-(--color-primary) rounded-lg">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-lg text-white/80 mb-8">
          Get exclusive deals, product updates, and special offers delivered to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-(--color-bg) border-0 text-(--color-text) placeholder-(--color-text) placeholder-opacity-50"
            aria-label="Email address for newsletter"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-(--color-bg) text-(--color-text) hover:bg-(--color-bg)/90 dark:bg-white dark:text-(--color-primary) dark:hover:bg-white/90 font-semibold px-8 whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {success && (
          <p className="mt-4 text-white/80 font-semibold">
            ✓ Successfully subscribed! Check your email for updates.
          </p>
        )}

        {error && <p className="mt-4 text-white/70 font-semibold">✗ {error}</p>}
      </div>
    </section>
  );
}

export default NewsletterSection;
