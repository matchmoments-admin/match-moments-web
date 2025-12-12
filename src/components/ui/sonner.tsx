"use client"

import {
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCloseCircleOutline,
} from "react-icons/io5"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IoCheckmarkCircleOutline className="size-4" />,
        info: <IoInformationCircleOutline className="size-4" />,
        warning: <IoWarningOutline className="size-4" />,
        error: <IoCloseCircleOutline className="size-4" />,
        loading: <AiOutlineLoading3Quarters className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
