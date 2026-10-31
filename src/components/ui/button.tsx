import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        earth: "earth-button",
        glass: "glass-button",
        lime: "lime-button",
        default: "bg-[#193B2A] text-white shadow-xs hover:bg-[#245B45] focus-visible:ring-[#193B2A]",
        primary: "bg-[#193B2A] text-white shadow-xs hover:bg-[#245B45] focus-visible:ring-[#193B2A]",
        destructive: "bg-[#991B1B] text-white shadow-xs hover:bg-[#7F1D1D] focus-visible:ring-[#991B1B]",
        outline:
          "border border-[#193B2A] text-[#193B2A] bg-transparent shadow-2xs hover:bg-[#F4F7F1] hover:text-[#122A1E]",
        secondary: "bg-[#E8EFE5] text-[#193B2A] shadow-2xs hover:bg-[#D8E4D3] font-semibold",
        ghost: "hover:bg-[#E8EFE5] hover:text-[#193B2A] text-[#193B2A]",
        link: "text-[#193B2A] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
