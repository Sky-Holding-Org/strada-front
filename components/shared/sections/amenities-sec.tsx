import {
  Lock,
  Star,
  Trees,
  Waves,
  Dumbbell,
  ParkingCircle,
  Shield,
  Baby,
  Building2,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  CircleCheckBig,
} from "lucide-react";

interface AmenitiesSection {
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  privacy: <Lock className="w-6 h-6" />,
  exclusivity: <Star className="w-6 h-6" />,
  greenery: <Trees className="w-6 h-6" />,
  pool: <Waves className="w-6 h-6" />,
  gym: <Dumbbell className="w-6 h-6" />,
  parking: <ParkingCircle className="w-6 h-6" />,
  security: <Shield className="w-6 h-6" />,
  playground: <Baby className="w-6 h-6" />,
  clubhouse: <Building2 className="w-6 h-6" />,
  spa: <Sparkles className="w-6 h-6" />,
  restaurant: <UtensilsCrossed className="w-6 h-6" />,
  mall: <ShoppingBag className="w-6 h-6" />,
};

export function AmenitiesSection({ amenities }: AmenitiesSection) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="text-primary">
            {amenityIcons[amenity.toLowerCase()] || (
              <CircleCheckBig className="w-6 h-6" />
            )}
          </div>
          <p className="text-sm font-medium capitalize">{amenity}</p>
        </div>
      ))}
    </div>
  );
}
