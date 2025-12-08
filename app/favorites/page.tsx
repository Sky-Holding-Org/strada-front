"use client";

import { useEffect, useState } from "react";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { SearchCompoundCard } from "@/components/search/search-compound-card";
import { SearchPropertyCard } from "@/components/search/search-property-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import type { Compound, Property } from "@/app/api/types";
import { useFavorites } from "@/contexts/favorites-context";

export default function FavoritesPage() {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    const favoriteIds = Array.from(favorites);

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        if (favoriteIds.length > 0) {
          const response = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: favoriteIds }),
          });

          if (response.ok) {
            const data = await response.json();
            setCompounds(data.compounds || []);
            setProperties(data.properties || []);
          }
        } else {
          setCompounds([]);
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const totalFavorites = favorites.size;

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <BreadcrumbCustom paths={[{ title: "Favorites" }]} className="mb-6" />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>
            {totalFavorites > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm("Are you sure you want to clear all favorites?")
                  ) {
                    localStorage.setItem("favorites", "[]");
                    setCompounds([]);
                    setProperties([]);
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-muted-foreground">
            {totalFavorites} {totalFavorites === 1 ? "item" : "items"} saved
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : totalFavorites === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground">
              Start adding compounds and properties to your favorites
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({totalFavorites})</TabsTrigger>
              <TabsTrigger value="compounds">
                Compounds ({compounds.length})
              </TabsTrigger>
              <TabsTrigger value="properties">
                Properties ({properties.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compounds.map((compound) => (
                  <SearchCompoundCard
                    key={compound.documentId}
                    compound={compound}
                  />
                ))}
                {properties.map((property) => (
                  <SearchPropertyCard
                    key={property.documentId}
                    property={property}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compounds" className="mt-6">
              {compounds.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No favorite compounds</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {compounds.map((compound) => (
                    <SearchCompoundCard
                      key={compound.documentId}
                      compound={compound}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No favorite properties
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <SearchPropertyCard
                      key={property.documentId}
                      property={property}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
