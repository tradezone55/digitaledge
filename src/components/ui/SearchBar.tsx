import { Search } from "lucide-react";
import Input from "./Input";
import { useSearch } from "@/hooks/useSearch";

const SearchBar = () => {
  const { handleChange, query } = useSearch();
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users, subscriptions, or plans..."
          value={query}
          onChange={handleChange}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SearchBar;
