"use client";
import { useRouter } from "next/navigation";

export default function GoBackButton({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex items-center gap-1 px-4 py-2 mb-6 rounded-full bg-white/90 text-neutral-900 font-medium text-sm shadow ring-1 ring-black/10 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 transition ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="-ml-1 mr-1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.25 14.25L6.75 9.75L11.25 5.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Go Back
    </button>
  );
}
