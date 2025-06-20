import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { SearchType } from "../App";

const searchTypeOptions: SearchType[] = ["Applicant", "Address"];

export function SearchBar({ 
  searchType,
  onSelect,
  search,
  onSearch 
}: { 
  searchType: SearchType,
  onSelect: (option: SearchType) => void,
  search: string,
  onSearch: (value: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

   /** Close the dropdown when clicking outside the menu. */
 useEffect(() => {
  function onClick(event: MouseEvent) {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  }
  document.addEventListener("mousedown", onClick);
  return () => document.removeEventListener("mousedown", onClick);
}, []);

  return (
    <div className="search-input-container" ref={searchContainerRef}>
      <button
        aria-label={dropdownOpen ? "Close dropdown to select search type" : "Open dropdown to select search type"}
        aria-expanded={dropdownOpen}
        aria-controls="search-type-dropdown"
        data-testid="search-type-dropdown-trigger"
        className="dropdown-button"
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
      >
        <span>{searchType}</span>
        {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} /> }
      </button>

      {dropdownOpen && (
        <ul id="search-type-dropdown" className="dropdown-menu" data-testid="search-type-dropdown-menu">
          {searchTypeOptions.map((option) => (
            <li
              key={option}
              className={
                option === searchType ? "dropdown-item selected" : "dropdown-item"
              }
              onClick={() => {
                onSelect(option);
                setDropdownOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      <div className="search-input-wrapper">
        <input
          data-testid="search-input"
          type="text"
          placeholder={
            searchType === "Applicant"
              ? "Search by applicant (eg. Bob's Donut Truck)"
              : "Search by street (eg. Sansome St)"
          }
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
        <Search size={18} className="search-icon" />
      </div>
    </div>
  )
}
