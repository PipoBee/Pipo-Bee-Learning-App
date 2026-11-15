import React, { useId, useMemo } from 'react';
import { findCountry, COUNTRIES } from '../../data/countries';

type Props = {
  countryCode: string;
  value: string;
  onChange: (value: string) => void;
  onDialCountryChange?: (code: string) => void;
  error?: string | null;
};

export const PhoneField: React.FC<Props> = ({
  countryCode,
  value,
  onChange,
  onDialCountryChange,
  error,
}) => {
  const errorId = useId();
  const inputId = useId();
  const country = findCountry(countryCode) || COUNTRIES[0];

  const dialOptions = useMemo(() => {
    const seen = new Set<string>();
    return COUNTRIES.filter((c) => {
      const key = `${c.dial}-${c.code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={inputId}>
        Contact *
      </label>
      <div className={`auth-phone${error ? ' has-error' : ''}`}>
        <label className="sr-only" htmlFor={`${inputId}-dial`}>
          Country calling code
        </label>
        <select
          id={`${inputId}-dial`}
          className="auth-phone-dial"
          value={countryCode || country.code}
          onChange={(e) => onDialCountryChange?.(e.target.value)}
          aria-label="Country calling code"
        >
          {dialOptions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.dial} {c.code}
            </option>
          ))}
        </select>
        <input
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="auth-phone-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="3001234567"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${errorId} ${inputId}-hint` : `${inputId}-hint`}
        />
      </div>
      <p id={`${inputId}-hint`} className="auth-hint">
        We use this only for your account and never share it.
      </p>
      {error ? (
        <p id={errorId} className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
