"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  /** Shown in the trigger when no value is selected. */
  placeholder: string;
  /** Search input placeholder. Defaults to "Suchen…". */
  searchPlaceholder?: string;
  /** Empty list message when search yields no results. */
  emptyText?: string;
  /** Label for the synthetic "clear" item rendered at the top of the list. */
  clearLabel?: string;
  /** Hide the clear option entirely (defaults to showing "—"). */
  hideClearOption?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  /** Accessible label for the combobox button. Falls back to placeholder. */
  ariaLabel?: string;
  /** Optional id for the trigger (useful with <Label htmlFor>). */
  id?: string;
};

type InternalItem = {
  /** Synthetic key (string) — `null` value uses a constant key. */
  key: string;
  /** Underlying value to emit; `undefined` means "clear". */
  value: string | undefined;
  label: string;
  isClear: boolean;
};

const CLEAR_KEY = "__combobox_clear__";

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Suchen…",
  emptyText = "Keine Treffer.",
  clearLabel = "—",
  hideClearOption = false,
  disabled,
  className,
  triggerClassName,
  ariaLabel,
  id,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const listboxId = useId();

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const items: InternalItem[] = useMemo(() => {
    const base: InternalItem[] = filteredOptions.map((o) => ({
      key: o.value,
      value: o.value,
      label: o.label,
      isClear: false,
    }));
    if (hideClearOption) return base;
    // Hide the synthetic clear item when a search yields no matches — show
    // the empty-state message instead.
    if (search.trim() !== "" && base.length === 0) return [];
    return [
      {
        key: CLEAR_KEY,
        value: undefined,
        label: clearLabel,
        isClear: true,
      },
      ...base,
    ];
  }, [filteredOptions, hideClearOption, clearLabel, search]);

  // Clamp the highlight to the current item range without writing back to
  // state — derived per render.
  const safeHighlightedIndex =
    items.length === 0 ? 0 : Math.min(Math.max(0, highlightedIndex), items.length - 1);

  // Auto-scroll highlighted item into view (guard for jsdom which doesn't
  // implement scrollIntoView).
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLLIElement>(
      `[data-combobox-index="${safeHighlightedIndex}"]`,
    );
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ block: "nearest" });
    }
  }, [safeHighlightedIndex, open]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch("");
      setHighlightedIndex(0);
    }
  }, []);

  const selectedLabel = useMemo(() => {
    if (value == null || value === "") return placeholder;
    const match = options.find((o) => o.value === value);
    return match?.label ?? value;
  }, [options, placeholder, value]);

  const isPlaceholder = value == null || value === "";

  const commit = useCallback(
    (next: InternalItem | undefined) => {
      if (!next) return;
      onChange(next.value);
      setOpen(false);
    },
    [onChange],
  );

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (items.length === 0) return;
        setHighlightedIndex((i) => (i + 1) % items.length);
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (items.length === 0) return;
        setHighlightedIndex((i) => (i - 1 + items.length) % items.length);
        return;
      }
      case "Home": {
        event.preventDefault();
        setHighlightedIndex(0);
        return;
      }
      case "End": {
        event.preventDefault();
        setHighlightedIndex(Math.max(0, items.length - 1));
        return;
      }
      case "Enter": {
        event.preventDefault();
        commit(items[safeHighlightedIndex]);
        return;
      }
      case "Escape": {
        // Let Popover close via its own handler; nothing to do here.
        return;
      }
      default:
        return;
    }
  };

  const activeItemId =
    items.length > 0
      ? `${listboxId}-opt-${items[safeHighlightedIndex]?.key}`
      : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between bg-surface-lifted px-3 text-sm font-normal shadow-sm",
            isPlaceholder && "text-muted-foreground",
            triggerClassName,
            className,
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) bg-surface-lifted p-0 ring-foreground/10"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="border-border flex items-center gap-2 border-b px-3">
          <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={searchPlaceholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeItemId}
            className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none disabled:opacity-50"
          />
        </div>

        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="max-h-72 overflow-y-auto py-1"
        >
          {items.length === 0 ? (
            <li className="text-muted-foreground px-3 py-2 text-sm">{emptyText}</li>
          ) : (
            items.map((item, i) => {
              const isHighlighted = i === safeHighlightedIndex;
              const isSelected = !item.isClear && item.value === value;
              return (
                <li
                  key={item.key}
                  id={`${listboxId}-opt-${item.key}`}
                  role="option"
                  aria-selected={isSelected}
                  data-combobox-index={i}
                  data-highlighted={isHighlighted ? "" : undefined}
                  onMouseDown={(event) => {
                    // Prevent the input from losing focus before click fires.
                    event.preventDefault();
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => commit(item)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                    isHighlighted && "bg-muted",
                    item.isClear && "text-muted-foreground",
                  )}
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{item.label}</span>
                </li>
              );
            })
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
