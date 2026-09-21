import starLogo from "../assets/home/star-logo.webp";

const lastUpdated = new Date(__LAST_UPDATED__).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

// The illustration and the last-updated date share one row.
export default function Footer({ image }) {
  return (
    <footer className="flex flex-col gap-10 -mb-8 px-4 pt-20 sm:flex-row sm:items-end sm:gap-12">
      {image}

      <ul className="font-heading flex flex-col gap-3 sm:ml-auto text-xs uppercase tracking-widest text-gray-500">
        <li className="flex items-center gap-3 text-gray-400">
          Last updated {lastUpdated}
          <img src={starLogo} alt="" className="h-5 w-5" />
        </li>
      </ul>
    </footer>
  );
}
