import React from "react";
import { Info } from "lucide-react";

export const HelpTooltip = ({ text }: { text: string }) => (
  <span
    title={text}
    className="text-gray-500 hover:text-green-600 cursor-help inline-flex items-center"
  >
    <Info size={16} />
  </span>
);
