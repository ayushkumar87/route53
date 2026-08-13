import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="inline-flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center text-sm font-medium text-[var(--color-aws-link)] hover:text-[var(--color-aws-link-hover)] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-[var(--color-aws-text-muted)]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
