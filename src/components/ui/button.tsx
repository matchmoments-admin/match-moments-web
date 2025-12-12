import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xl font-normal text-black transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90 hover:no-underline",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:no-underline",
        outline:
          "border border-black bg-transparent hover:bg-black hover:text-white hover:no-underline",
        secondary:
          "bg-transparent text-black hover:underline",
        ghost:
          "bg-transparent text-black hover:underline",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto px-0 py-0 text-xl",
        sm: "h-auto px-0 py-0 text-base",
        lg: "h-auto px-0 py-0 text-2xl",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "link",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
