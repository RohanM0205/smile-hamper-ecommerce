"use client";

import { useEffect, useState } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";

export default function ShareButtons({
  productName,
}: {
  productName: string;
}) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    if (!currentUrl) return;

    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${productName} - ${currentUrl}`
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">

      {/* WhatsApp Share */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 
                   px-4 py-2 rounded-full 
                   bg-green-50 text-green-700
                   border border-green-200
                   hover:bg-green-100 
                   transition text-sm font-medium"
      >
        <Share2 size={16} />
        Share
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 
                   px-4 py-2 rounded-full 
                   bg-[#f3ece5] text-[#5a3e2b]
                   border border-[#e0d4c7]
                   hover:bg-[#e9dfd4]
                   transition text-sm font-medium"
      >
        <LinkIcon size={16} />
        {copied ? "Copied ✓" : "Copy Link"}
      </button>
    </div>
  );
}