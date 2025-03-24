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
    <div className="mb-4 animate-fade-in">
      <label htmlFor={id} className="block text-sm font-medium text-softWhite/80 mb-1">
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
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-softWhite placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}