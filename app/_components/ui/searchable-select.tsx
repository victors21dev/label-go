"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";

type Option = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  className?: string;
  name?: string;
  defaultValue?: string;
};

export function SearchableSelect({
  value: controlledValue,
  onValueChange,
  placeholder = "Selecione...",
  options,
  className,
  name,
  defaultValue,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const selectedLabel = options.find((o) => o.value === selectedValue)?.label;

  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {name && (
        <input type="hidden" name={name} value={selectedValue} />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            className={cn(
              "border-input data-placeholder:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 text-left",
              !selectedLabel && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {selectedLabel || placeholder}
            </span>
            <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
        >
          <div className="flex items-center border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50 mr-2" />
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 h-9 px-0"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm text-left outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    selectedValue === option.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {selectedValue === option.value && (
                    <CheckIcon className="size-4 shrink-0 absolute right-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
