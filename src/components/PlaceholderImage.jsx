// Plain placeholder standing in for a real project screenshot. Replace with
// an actual <img> once you have real images — see WorkShowcase.jsx and
// CaseStudy.jsx for where this is used.

export default function PlaceholderImage({ label = "[Image placeholder]", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center border border-gray-300 bg-gray-50 text-xs text-gray-400 ${className}`}
    >
      {label}
    </div>
  );
}
