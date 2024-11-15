"use client";

import { Textarea } from "@/components/ui/textarea";
import useWidth from "@/hooks/useWidth";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

type Props = {} & React.ComponentProps<typeof Textarea>;

export default function MessageBox({
  className,
  disabled = true,
  ...props
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const width = useWidth();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = (ref.current.scrollHeight + 2) + "px";
    }
  }, [width]);

  return (
    <Textarea
      ref={ref}
      disabled={disabled}
      className={cn(
        "w-full disabled:bg-gray-200 disabled:text-black text-black rounded-lg p-2 resize-none disabled:cursor-text",
        className
      )}
      rows={1}
      {...props}
    />
  );
}
