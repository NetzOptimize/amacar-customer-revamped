import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const ReusableTooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 4,
  className = "",
  disabled = false,
  variant = "error", // "error", "info", "warning", "success"
  delayDuration = 0,
  ...props
}) => {
  if (!content || disabled) {
    return <>{children}</>;
  }

  // Variant styles
  const getVariantStyles = (variant) => {
    switch (variant) {
      case "error":
        return "bg-red-500 text-white border-red-500";
      case "info":
        return "bg-blue-500 text-white border-blue-500";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-500";
      case "success":
        return "bg-green-500 text-white border-green-500";
      default:
        return "bg-red-500 text-white border-red-500";
    }
  };

  return (
    <Tooltip delayDuration={delayDuration} {...props}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={`${getVariantStyles(variant)} ${className}`}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default ReusableTooltip;
