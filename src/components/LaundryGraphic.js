export default function LaundryGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-secondary/15 blur-2xl" />
      <svg viewBox="0 0 320 320" className="w-full drop-shadow-xl">
        <defs>
          <linearGradient id="machineBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eaf1fb" />
          </linearGradient>
          <linearGradient id="drum" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e88e5" />
            <stop offset="100%" stopColor="#062357" />
          </linearGradient>
        </defs>
        <rect x="30" y="20" width="260" height="280" rx="28" fill="url(#machineBody)" stroke="#0b3a8a" strokeWidth="4" />
        <rect x="55" y="42" width="210" height="26" rx="10" fill="#0b3a8a" opacity="0.08" />
        <circle cx="70" cy="55" r="6" fill="#f2b705" />
        <circle cx="92" cy="55" r="6" fill="#1e88e5" />
        <circle cx="114" cy="55" r="6" fill="#0b3a8a" />
        <circle cx="160" cy="175" r="92" fill="#0b3a8a" opacity="0.06" />
        <circle cx="160" cy="175" r="78" fill="url(#drum)" />
        <circle cx="160" cy="175" r="78" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="10" />
        <circle cx="160" cy="175" r="56" fill="#062357" opacity="0.5" />
        {/* bubbles inside drum */}
        <circle cx="135" cy="155" r="9" fill="#ffffff" opacity="0.85" />
        <circle cx="178" cy="140" r="6" fill="#ffffff" opacity="0.7" />
        <circle cx="190" cy="190" r="11" fill="#ffffff" opacity="0.55" />
        <circle cx="140" cy="200" r="5" fill="#ffffff" opacity="0.6" />
        {/* feet */}
        <rect x="55" y="298" width="18" height="14" rx="4" fill="#0b3a8a" />
        <rect x="247" y="298" width="18" height="14" rx="4" fill="#0b3a8a" />
      </svg>

      {/* floating bubbles around graphic */}
      <span className="bubble absolute -left-4 top-6 h-6 w-6 animate-float-slow" />
      <span className="bubble absolute -right-3 bottom-10 h-9 w-9 animate-float-slower" />
      <span className="bubble absolute right-10 top-0 h-4 w-4 animate-float-slow" style={{ animationDelay: '0.6s' }} />
    </div>
  );
}
