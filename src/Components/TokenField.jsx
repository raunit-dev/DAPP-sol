import React from 'react';

export function TokenField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  min,
  step
}) {
  return (
    <div className="mb-4 animate-slide-up">
      <label htmlFor={id} className="token-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className="token-input"
      />
    </div>
  );
}