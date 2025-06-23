import React from "react";

interface SettingsSectionProps {
  label?: string;
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  label,
  title,
  children,
}: SettingsSectionProps) {
  const heading = label || title;
  return (
    <section className="mb-6">
      {heading && <h2 className="mb-2 text-lg font-semibold">{heading}</h2>}
      <div>{children}</div>
    </section>
  );
}

interface ButtonOption {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

interface SettingsButtonGroupProps {
  options?: ButtonOption[];
  children?: React.ReactNode;
}

export function SettingsButtonGroup({
  options,
  children,
}: SettingsButtonGroupProps) {
  if (options && options.length > 0) {
    return (
      <div className="mt-2 flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${opt.isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"} hover:scale-105 active:scale-95`}
            onClick={opt.onClick}
            aria-pressed={opt.isSelected}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }
  return <div className="mt-2 flex gap-2">{children}</div>;
}
