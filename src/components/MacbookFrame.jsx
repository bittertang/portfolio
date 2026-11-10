// CSS-only MacBook mockup: a dark-bezeled 16:10 screen sitting on a slightly
// wider aluminum base. Children fill the screen area (cropped to fit).
export default function MacbookFrame({ children, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      {/* Lid: bezel around the screen, with a small camera dot */}
      <div className="relative mx-auto w-[88%] rounded-t-[1.1rem] bg-gray-900 p-[1.6%] pb-[2.2%] shadow-lg ring-1 ring-gray-700">
        <span className="absolute left-1/2 top-[0.6%] h-[0.35rem] w-[0.35rem] -translate-x-1/2 rounded-full bg-gray-700" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.2rem] bg-black [&>*]:h-full [&>*]:w-full [&>*]:object-cover">
          {children}
        </div>
      </div>
      {/* Base: thin deck with the thumb notch, tapering underneath */}
      <div className="relative mx-auto h-[0.9rem] w-full rounded-b-[1rem] rounded-t-[0.15rem] bg-gradient-to-b from-gray-300 to-gray-400 shadow-md">
        <span className="absolute left-1/2 top-0 h-[0.35rem] w-[14%] -translate-x-1/2 rounded-b-md bg-gray-400/80" />
      </div>
    </div>
  );
}
