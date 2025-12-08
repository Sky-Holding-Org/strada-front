import { Home, Slash } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbPath {
  title: string;
  href?: string;
}

interface BreadcrumbCustom {
  paths: BreadcrumbPath[];
  className?: string;
}

export function BreadcrumbCustom({ paths, className }: BreadcrumbCustom) {
  return (
    <Breadcrumb className={cn("py-2", className)}>
      <BreadcrumbList className="flex-wrap gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium text-[#05596B]">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((path, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator></BreadcrumbSeparator>
            <BreadcrumbItem>
              {path.href ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={path.href}
                    className="text-sm text-[#05596B] font-medium hover:text-primary transition-colors"
                  >
                    {path.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-sm font-medium text-[#05596B]">
                  {path.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
