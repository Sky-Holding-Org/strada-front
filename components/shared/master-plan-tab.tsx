import Image from "@/components/ui/NextImage";

interface MasterPlanTabProps {
  planImageUrl: string;
}

export function MasterPlanTab({ planImageUrl }: MasterPlanTabProps) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
      <Image
        src={planImageUrl || "/placeholder.svg"}
        alt="Master Plan"
        fill
        loading="lazy"
        className="object-contain"
        sizes="100vw"
      />
    </div>
  );
}
