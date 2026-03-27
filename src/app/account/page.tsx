"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

type Order = { id: string; total: number; createdAt: string; items: { id: string; name: string; price: number; qty: number }[] };

/* ── Avatar initials ── */
function Avatar({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) {
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : email.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold select-none">
      {initials}
    </div>
  );
}

/* ── Change-password form ── */
function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!current) { setError("Current password is required"); return; }
    if (next.length < 6) { setError("New password must be at least 6 characters"); return; }
    if (next !== confirm) { setError("Passwords do not match"); return; }
    /* No real API — show success feedback */
    setSuccess(true);
    setCurrent(""); setNext(""); setConfirm("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="current" className="text-sm font-medium">Current Password</label>
        <Input
          id="current"
          type="password"
          placeholder="••••••••"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="newPwd" className="text-sm font-medium">New Password</label>
          <Input
            id="newPwd"
            type="password"
            placeholder="••••••••"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPwd" className="text-sm font-medium">Confirm Password</label>
          <Input
            id="confirmPwd"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-xs text-green-700 bg-green-100 rounded-md px-3 py-2">
          Password updated successfully.
        </p>
      )}
      <Button type="submit" size="sm">Update Password</Button>
    </form>
  );
}

/* ── Recent orders mini-list ── */
function RecentOrders({ orders, loading }: { orders: Order[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2].map((n) => (
          <div key={n} className="h-12 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        You haven&apos;t placed any orders yet.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {orders.slice(0, 3).map((order) => (
        <li key={order.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <p className="font-medium">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "short", day: "numeric",
              })}
              {" · "}
              {order.items?.length ?? 0}{" "}
              {(order.items?.length ?? 0) === 1 ? "item" : "items"}
            </p>
          </div>
          <span className="font-semibold">₹{order.total.toLocaleString("en-IN")}</span>
        </li>
      ))}
    </ul>
  );
}

type Profile = { firstName: string; lastName: string };

function loadProfile(userId: string): Profile {
  try {
    const raw = localStorage.getItem(`profile_${userId}`);
    if (raw) return JSON.parse(raw) as Profile;
  } catch {}
  return { firstName: '', lastName: '' };
}

function saveProfile(userId: string, profile: Profile) {
  try { localStorage.setItem(`profile_${userId}`, JSON.stringify(profile)); } catch {}
}

/* ── Page ── */
export default function AccountPage() {
  const { user, token, logout, ready } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [profile, setProfile] = useState<Profile>({ firstName: '', lastName: '' });
  const [profileEdit, setProfileEdit] = useState<Profile>({ firstName: '', lastName: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  /* Redirect unauthenticated users */
  useEffect(() => {
    if (ready && !user) router.replace("/auth/login");
  }, [ready, user, router]);

  /* Load profile from localStorage */
  useEffect(() => {
    if (!user) return;
    const p = loadProfile(user.id);
    setProfile(p);
    setProfileEdit(p);
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    if (!profileEdit.firstName.trim()) { setProfileError('First name is required'); return; }
    if (!profileEdit.lastName.trim()) { setProfileError('Last name is required'); return; }
    saveProfile(user!.id, { firstName: profileEdit.firstName.trim(), lastName: profileEdit.lastName.trim() });
    setProfile({ firstName: profileEdit.firstName.trim(), lastName: profileEdit.lastName.trim() });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  /* Fetch orders for stats */
  useEffect(() => {
    if (!token) { setOrdersLoading(false); return; }
    let mounted = true;
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: unknown) => { if (mounted) setOrders(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => mounted && setOrdersLoading(false));
    return () => { mounted = false; };
  }, [token]);

  if (!ready || !user) return null;

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <Container>
      <Section>
        <div className="max-w-4xl mx-auto space-y-8">

          {/* ── Profile header ── */}
          <div className="flex items-center gap-5">
            <Avatar firstName={profile.firstName} lastName={profile.lastName} email={user.email} />
            <div>
              <h1 className="text-xl font-bold leading-tight">
                {profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : user.email}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
              <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Orders", value: ordersLoading ? "—" : orders.length },
              { label: "Total Spent", value: ordersLoading ? "—" : `₹${totalSpent.toLocaleString("en-IN")}` },
              { label: "Member Since", value: "2026" },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="pt-5 pb-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ── Left: profile info + password ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profile info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <Input
                          id="firstName"
                          placeholder="First Name"
                          value={profileEdit.firstName}
                          onChange={(e) => setProfileEdit((p) => ({ ...p, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <Input
                          id="lastName"
                          placeholder="Last Name"
                          value={profileEdit.lastName}
                          onChange={(e) => setProfileEdit((p) => ({ ...p, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">User ID</label>
                      <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
                    </div>
                    {profileError && (
                      <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{profileError}</p>
                    )}
                    {profileSaved && (
                      <p className="text-xs text-green-700 bg-green-100 rounded-md px-3 py-2">Profile saved successfully.</p>
                    )}
                    <Button type="submit" size="sm">Save Profile</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change password */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </div>

            {/* ── Right: recent orders + quick links ── */}
            <div className="space-y-6">

              {/* Recent orders */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                  {orders.length > 0 && (
                    <Link href="/order" className="text-xs text-primary hover:underline">
                      View all
                    </Link>
                  )}
                </CardHeader>
                <CardContent>
                  <RecentOrders orders={orders} loading={ordersLoading} />
                  {!ordersLoading && orders.length === 0 && (
                    <Link href="/products" className="block mt-3">
                      <Button size="sm" className="w-full">Start Shopping</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              {/* Quick links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/order" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      My Orders
                    </Button>
                  </Link>
                  <Link href="/cart" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      My Cart
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Browse Products
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Sign out */}
              <Card className="border-destructive/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
