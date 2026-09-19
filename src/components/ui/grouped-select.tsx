"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface GroupedSelectOption {
  key: string;
  label: string;
  isGroupTitle?: boolean;
  isSeparator?: boolean;
}

interface GroupedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: GroupedSelectOption[];
  className?: string;
}

export function GroupedSelect({
  value,
  onChange,
  options,
  className,
}: GroupedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (opt) => opt.key === value && !opt.isGroupTitle && !opt.isSeparator,
  );
  const displayLabel = selectedOption?.label || "Select Demo...";

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 200),
      zIndex: 9999,
    });
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    updateMenuPosition();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, updateMenuPosition]);

  const handleSelect = (option: GroupedSelectOption) => {
    if (option.isGroupTitle || option.isSeparator) return;
    onChange(option.key);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="flex w-full items-center justify-between gap-2 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-pop transition-colors hover:bg-muted focus:outline-none"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="max-h-72 overflow-y-auto rounded-2xl border-2 border-foreground bg-card p-1.5 text-foreground shadow-pop-lg"
          >
            {options.map((option, index) => {
              if (option.isSeparator) {
                return (
                  <div
                    key={`${option.key}-${index}`}
                    className="my-1.5 border-t-2 border-border"
                  />
                );
              }

              if (option.isGroupTitle) {
                return (
                  <div
                    key={option.key}
                    className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-accent"
                  >
                    {option.label}
                  </div>
                );
              }

              const isSelected = option.key === value;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-colors",
                    isSelected
                      ? "bg-tertiary font-black text-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="text-xs font-bold text-accent">✓</span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
