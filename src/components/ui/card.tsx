// src/components/ui/card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variantes du Card
const cardVariants = cva(
  "rounded-lg bg-white text-gray-900 shadow p-4",
  {
    variants: {
      variant: {
        default: "border border-gray-200",
        elevated: "shadow-lg",
        outlined: "border border-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Interface du Card
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

// Composant Card principal
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// Sous-composants du Card
const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("mb-3 text-lg font-semibold", className)}>{children}</div>
);
const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("text-gray-700", className)}>{children}</div>
);
const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h2 className={cn("text-xl font-bold", className)}>{children}</h2>
);
const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn("text-gray-500", className)}>{children}</p>
);
const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("mt-4 flex items-center justify-between", className)}>{children}</div>
);
// Exportation
export { Card, CardHeader, CardContent, CardTitle, CardDescription,CardFooter };
