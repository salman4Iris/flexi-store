"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/AuthProvider';
import { signIn } from 'next-auth/react';



const LoginPage = (): React.ReactElement => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<string | null>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            // use AuthProvider to set user/token
            if (data.token) login(data.token, data.user);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'linkedin'): Promise<void> => {
        setOauthLoading(provider);
        try {
            const result = await signIn(provider, { redirect: false, callbackUrl: '/' });
            if (result?.ok) {
                router.push('/');
            } else if (result?.error) {
                setError(`${provider} login failed: ${result.error}`);
            }
        } catch (err) {
            setError(`${provider} login error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setOauthLoading(null);
        }
    };

    return (
        <Container>
            <Section>
                <div className="flex items-center justify-center min-h-screen">
                    <Card className="w-full max-w-md">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </form>

                            {/* Social Login Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => void handleSocialLogin('google')}
                                    disabled={oauthLoading !== null}
                                >
                                    {oauthLoading === 'google' ? 'Signing in with Google...' : '🔵 Google'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => void handleSocialLogin('linkedin')}
                                    disabled={oauthLoading !== null}
                                >
                                    {oauthLoading === 'linkedin' ? 'Signing in with LinkedIn...' : '🔗 LinkedIn'}
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href="/auth/register" className="text-primary underline hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </Section>
        </Container>
    );
};

export default LoginPage;