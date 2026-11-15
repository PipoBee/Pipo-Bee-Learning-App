import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, CountryOption } from '../../data/countries';

type Props = {
  value: string;
  onChange: (code: string) => void;
  error?: string | null;
  label?: string;
  required?: boolean;
};

export const CountrySelect: React.FC<Props> = ({
  value,
  onChange,
  error,
  label = 'Country',
  required = true,
}) => {
  const listId = useId();
  const errorId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find((c) => c.code === value) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dial.includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const choose = (country: CountryOption) => {
    onChange(country.code);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) choose(item);
    }
  };

  return (
    <div className="auth-field" ref={rootRef}>
      <label className="auth-label" htmlFor={`${listId}-trigger`}>
        {label}
        {required ? ' *' : ''}
      </label>
      <button
        id={`${listId}-trigger`}
        type="button"
        className={`auth-input auth-select-trigger${error ? ' has-error' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span>{selected ? `${selected.name} (${selected.dial})` : 'Search and choose a country'}</span>
        <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
      {open && (
        <div className="auth-select-panel">
          <div className="auth-select-search">
            <Search size={16} strokeWidth={2.2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search countries"
              aria-label="Search countries"
              autoFocus
            />
          </div>
          <ul id={listId} role="listbox" className="auth-select-list" aria-label="Countries">
            {filtered.map((country, index) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={country.code === value}
                  className={`auth-select-option${index === activeIndex ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(country)}
                >
                  <span>{country.name}</span>
                  <span>{country.dial}</span>
                </button>
              </li>
            ))}
            {!filtered.length && <li className="auth-select-empty">No countries match</li>}
          </ul>
        </div>
      )}
      {error ? (
        <p id={errorId} className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
