import { Link } from "react-router";
import { RiHeartFill } from "@remixicon/react";

const SupportBanner = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <Link
        to="https://ko-fi.com/hermanhall?utm_source=networkplus"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <RiHeartFill className="w-4 h-4 text-white" />
        <span className="text-white text-sm">Support on Ko-fi</span>
      </Link>
    );
  }

  return (
    <div className="container mx-auto px-5 py-8 max-w-6xl">
      <div className="flex justify-center items-center">
        <Link
          to="https://ko-fi.com/hermanhall?utm_source=networkplus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <RiHeartFill className="w-5 h-5 text-white" />
          <span className="text-white">Support on Ko-fi</span>
        </Link>
      </div>
    </div>
  );
};

export default SupportBanner;

