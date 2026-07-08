'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Loader2, Search, Plus, X } from 'lucide-react';

function getMatchValue(item, matchField) {
  if (!item || typeof item !== 'object') return '';

  const directValue = item[matchField];
  if (directValue !== undefined && directValue !== null && directValue !== '') {
    return String(directValue);
  }

  const refValue = item?._ref?.match?.[matchField];
  if (refValue !== undefined && refValue !== null && refValue !== '') {
    return String(refValue);
  }

  return '';
}

function getDisplayValue(item, displayField) {
  if (!item || typeof item !== 'object') return '';

  const directValue = item[displayField];
  if (directValue !== undefined && directValue !== null && directValue !== '') {
    return String(directValue);
  }

  const refValue = item?._ref?.match?.[displayField];
  if (refValue !== undefined && refValue !== null && refValue !== '') {
    return String(refValue);
  }

  return '';
}

function getSearchText(item) {
  if (!item || typeof item !== 'object') return '';

  const values = [];
  for (const value of Object.values(item)) {
    if (typeof value === 'string') {
      values.push(value);
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const nested of Object.values(value)) {
        if (typeof nested === 'string') values.push(nested);
      }
    }
  }

  return values.join(' ').toLowerCase();
}

export function MasterListPicker({
  source,
  path,
  displayField = 'name',
  matchField = 'slug',
  onSelect,
  onSelectMany,
  currentItems = [],
  placeholder = 'Pilih dari Master List',
  searchPlaceholder = 'Cari item...',
  multiSelect = false,
  maxSelections,
}) {
  const [masterList, setMasterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [draftSelection, setDraftSelection] = useState([]);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);
  const canUsePortal = typeof document !== 'undefined';

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery('');
    setDraftSelection([]);
    setDropdownStyle(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const spaceBelow = window.innerHeight - rect.bottom;
      const fitsBelow = spaceBelow >= 320;
      const top = fitsBelow ? rect.bottom + 6 : Math.max(8, rect.top - 6 - 360);

      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${rect.left}px`,
        width: `${width}px`,
        maxWidth: 'calc(100vw - 16px)',
        zIndex: 1000,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const handlePointerDown = (event) => {
      if (buttonRef.current?.contains(event.target) || dropdownRef.current?.contains(event.target)) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  const currentMatchValues = useMemo(() => {
    return new Set(
      (Array.isArray(currentItems) ? currentItems : [])
        .map((item) => getMatchValue(item, matchField))
        .filter(Boolean)
    );
  }, [currentItems, matchField]);

  const availableItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return masterList.filter((item) => {
      const matchValue = getMatchValue(item, matchField);
      if (!matchValue || currentMatchValues.has(matchValue)) return false;
      if (!q) return true;

      const displayValue = getDisplayValue(item, displayField).toLowerCase();
      const searchText = getSearchText(item);
      return displayValue.includes(q) || searchText.includes(q) || matchValue.toLowerCase().includes(q);
    });
  }, [masterList, query, currentMatchValues, displayField, matchField]);

  const selectedCount = currentMatchValues.size;
  const selectedVisibleCount = draftSelection.length;
  const totalSelectedCount = selectedCount + selectedVisibleCount;
  const hasSelectionLimit = Number.isInteger(maxSelections) && maxSelections > 0;
  const remainingSlots = hasSelectionLimit ? Math.max(maxSelections - selectedCount, 0) : Infinity;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/master-list?source=${encodeURIComponent(source)}&path=${encodeURIComponent(path)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.items)) {
          setMasterList(data.items);
        } else {
          setError(data.error || 'Failed to fetch master list');
        }
      } catch {
        setError('Failed to fetch master list');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [source, path]);

  const toggleSelection = (item) => {
    const matchValue = getMatchValue(item, matchField);
    if (!matchValue) return;

    setDraftSelection((prev) => {
      if (prev.includes(matchValue)) {
        return prev.filter((value) => value !== matchValue);
      }

      if (hasSelectionLimit && selectedCount + prev.length >= maxSelections) {
        return prev;
      }

      return [...prev, matchValue];
    });
  };

  const selectAllVisible = () => {
    if (hasSelectionLimit && remainingSlots <= 0) return;
    const nextValues = availableItems
      .map((item) => getMatchValue(item, matchField))
      .filter(Boolean)
      .slice(0, remainingSlots);
    setDraftSelection(nextValues);
  };

  const clearSelection = () => {
    setDraftSelection([]);
  };

  const commitSelection = () => {
    if (!multiSelect || !onSelectMany) return;

    const selectedItems = masterList.filter((item) => {
      const matchValue = getMatchValue(item, matchField);
      return matchValue && draftSelection.includes(matchValue) && !currentMatchValues.has(matchValue);
    });

    if (selectedItems.length === 0) return;

    onSelectMany(hasSelectionLimit ? selectedItems.slice(0, remainingSlots) : selectedItems);
    closeDropdown();
  };

  const handleSelectSingle = (item) => {
    if (!item || !onSelect) return;
    onSelect(item);
    closeDropdown();
  };

  const triggerLabel = multiSelect
    ? hasSelectionLimit
      ? selectedCount > 0
        ? `${placeholder} (${selectedCount}/${maxSelections} dipilih)`
        : `${placeholder} (maks ${maxSelections} item)`
      : selectedCount > 0
        ? `${placeholder} (${selectedCount} dipilih)`
        : placeholder
    : placeholder;

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={dropdownStyle || undefined}
    >
      <div className="border-b border-gray-200 p-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {hasSelectionLimit && (
        <div className="border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
          Maksimal {maxSelections} item.
        </div>
      )}

      {error ? (
        <div className="px-4 py-3 text-sm text-red-600">{error}</div>
      ) : multiSelect ? (
        <>
          {hasSelectionLimit && (
            <div className="border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
              Maksimal {maxSelections} item.
            </div>
          )}
          <div className="max-h-64 overflow-auto">
            {availableItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">Tidak ada item yang tersedia.</div>
            ) : (
              availableItems.map((item) => {
                const matchValue = getMatchValue(item, matchField);
                const displayValue = getDisplayValue(item, displayField) || matchValue || 'Untitled';
                const checked = draftSelection.includes(matchValue);

                const canAddMore = checked || !hasSelectionLimit || totalSelectedCount < maxSelections;

                return (
                  <button
                    key={matchValue}
                    type="button"
                    onClick={() => toggleSelection(item)}
                    disabled={!canAddMore}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-blue-50' : ''}`}
                  >
                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'}`}>
                      {checked && <Check size={11} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{displayValue}</span>
                    <span className="text-xs text-gray-400">{matchValue}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllVisible}
                disabled={availableItems.length === 0 || (hasSelectionLimit && remainingSlots <= 0)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-50"
              >
                <Plus size={12} />
                Select All
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={selectedVisibleCount === 0}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800 disabled:opacity-50"
              >
                <X size={12} />
                Clear
              </button>
            </div>

            <button
              type="button"
              onClick={commitSelection}
              disabled={selectedVisibleCount === 0}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Check size={12} />
              Add Selected
            </button>
          </div>
        </>
      ) : availableItems.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500">All item already selected</div>
      ) : (
        <div className="max-h-64 overflow-auto">
          {availableItems.map((item) => {
            const matchValue = getMatchValue(item, matchField);
            const displayValue = getDisplayValue(item, displayField) || matchValue || 'Untitled';

            return (
              <button
                key={matchValue}
                type="button"
                onClick={() => handleSelectSingle(item)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-blue-50"
              >
                <span className="min-w-0 flex-1 truncate">{displayValue}</span>
                <span className="text-xs text-gray-400">{matchValue}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => isOpen ? closeDropdown() : setIsOpen(true)}
        disabled={loading}
        className="w-full flex items-center justify-between gap-3 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span className="truncate text-left">{triggerLabel}</span>
          )}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && canUsePortal && createPortal(dropdownContent, document.body)}
    </div>
  );
}
