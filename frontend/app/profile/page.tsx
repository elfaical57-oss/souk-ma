"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Store, MapPin, Phone, Mail, LogOut, ShoppingBag, MessageCircle } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/lib/stores/authStore";
import useLangStore from "@/lib/stores/langStore";
import api from "@/lib/api";

interface FullUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  city?: string;
  avatar?: string;
  sellerProfile?: {
    businessName: string;
    whatsapp: string;
    description?: string;
    rating?: number;
    city: string;
  };
}

export default function ProfilePage() {
  const { user, logout, fetchMe } = useAuthStore();
  const { t } = useLangStore();
  const router = useRouter();
  const [fullUser, setFullUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    api.get("/auth/me")
      .then((res) => setFullUser(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!fullUser) return null;

  const initials = fullUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container max-w-2xl">
        {/* Header card */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{fullUser.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{fullUser.email}</p>
              <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                fullUser.role === "SELLER" ? "bg-orange-100 text-orange-700" :
                fullUser.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {fullUser.role === "SELLER" ? "Vendeur" : fullUser.role === "ADMIN" ? "Admin" : "Acheteur"}
              </span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="card p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Informations personnelles
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{fullUser.email}</span>
            </div>
            {fullUser.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{fullUser.phone}</span>
              </div>
            )}
            {fullUser.city && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{fullUser.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Seller profile card */}
        {fullUser.sellerProfile && (
          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Store className="w-4 h-4" /> Boutique
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Store className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-gray-800">{fullUser.sellerProfile.businessName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{fullUser.sellerProfile.city}</span>
              </div>
              {fullUser.sellerProfile.whatsapp && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">WhatsApp: {fullUser.sellerProfile.whatsapp}</span>
                </div>
              )}
              {typeof fullUser.sellerProfile.rating === "number" && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-700">{fullUser.sellerProfile.rating.toFixed(1)} / 5</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="card p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            {(fullUser.role === "SELLER" || fullUser.role === "ADMIN") && (
              <Link href={`/dashboard/${fullUser.role.toLowerCase()}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-sm font-medium transition-colors">
                <Store className="w-4 h-4" /> Tableau de bord
              </Link>
            )}
            <Link href="/chat"
              className="flex items-center gap-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium transition-colors">
              <MessageCircle className="w-4 h-4" /> Messages
            </Link>
            <Link href="/products"
              className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors">
              <ShoppingBag className="w-4 h-4" /> Produits
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </div>
    </div>
  );
}
