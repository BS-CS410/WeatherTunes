import React, { useState } from "react";
import { SettingsCard } from "@/components/SettingsCard";

export function SettingsButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open settings"
        onClick={() => setIsMenuOpen(true)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15A1.65 1.65 0 0 0 20 13.6L21.2 12C21.4 11.7 21.4 11.3 21.2 11L20 9.4A1.65 1.65 0 0 0 19.4 9L18 8.6V7A1 1 0 0 0 17 6H15.4L15 4.6A1.65 1.65 0 0 0 13.6 4L12 2.8C11.7 2.6 11.3 2.6 11 2.8L9.4 4A1.65 1.65 0 0 0 9 4.6L8.6 6H7A1 1 0 0 0 6 7V8.6L4.6 9A1.65 1.65 0 0 0 4 9.4L2.8 11C2.6 11.3 2.6 11.7 2.8 12L4 13.6A1.65 1.65 0 0 0 4.6 15L6 15.4V17A1 1 0 0 0 7 18H8.6L9 19.4A1.65 1.65 0 0 0 10.4 20L12 21.2C12.3 21.4 12.7 21.4 13 21.2L14.6 20A1.65 1.65 0 0 0 15 19.4L15.4 18H17A1 1 0 0 0 18 17V15.4L19.4 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <SettingsCard isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
