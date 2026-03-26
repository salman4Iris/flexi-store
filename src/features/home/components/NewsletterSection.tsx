'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function NewsletterSection(): React.ReactNode {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!email) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Get exclusive deals, product updates, and special offers delivered to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-white border-0 text-gray-900 placeholder-gray-500"
            aria-label="Email address for newsletter"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {success && (
          <p className="mt-4 text-green-100 font-semibold">
            ✓ Successfully subscribed! Check your email for updates.
          </p>
        )}

        {error && <p className="mt-4 text-red-100 font-semibold">✗ {error}</p>}
      </div>
    </section>
  );
}

export default NewsletterSection;
