import { useState, useRef, useEffect } from 'react';
import { Status } from '../App';
import { ChevronDown, ChevronUp } from "lucide-react";

const statuses: Status[] = ["Approved", "Expired", "Requested", "All"]

export function StatusFilter({ currentStatus, onSelect }: { currentStatus: Status, onSelect: (option: Status) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  /** Close the dropdown when clicking outside the menu. */
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="status-filter-container" ref={filterRef}>
      <span>Filter by: </span>
      <div className="dropdown-wrapper">
        {/** Status dropdown trigger */}
        <button
          aria-label={dropdownOpen ? "Close dropdown to filter by status" : "Open dropdown to filter by status"}
          aria-expanded={dropdownOpen}
          aria-controls="status-dropdown-menu"
          data-testid="status-dropdown-trigger"
          className="dropdown-button"
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <span>{currentStatus}</span>
          {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} /> }
        </button>

        {/** Status dropdown menu */}
        {dropdownOpen && (
          <ul id="status-dropdown-menu" className="dropdown-menu">
            {statuses.map((option) => (
              <li
                key={option}
                className={
                  option === currentStatus ? "dropdown-item selected" : "dropdown-item"
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
      </div>
    </div>
  )
}