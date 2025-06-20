import { useState, useEffect } from "react";
import { fetchFoodTrucks, FoodTruck } from "./api";
import './App.css';
import { FoodTruckTable } from "./components/FoodTruckTable";
import { SearchBar } from "./components/SearchBar";
import { StatusFilter } from "./components/StatusFilter";

export type SearchType = "Applicant" | "Address";
export type Status = "Approved" | "Requested" | "Expired" | "All";

const PAGE_SIZE = 10;

const columns = [
  { label: "Applicant", key: "applicant" },
  { label: "Facility Type", key: "facility_type" },
  { label: "Food Items", key: "food_items" },
  { label: "Address", key: "Address" },
  { label: 'Status', key: "status" },
  { label: 'Permit', key: "permit" },
];

function getPaginatedFoodTrucks(foodTrucks: FoodTruck[], page: number) {
  const totalPages = foodTrucks.length
  ? Math.ceil(foodTrucks.length / PAGE_SIZE)
  : 1;

  const pageTrucks = foodTrucks.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const totalTruckCount = foodTrucks.length;
  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalTruckCount);

  return { totalPages, pageTrucks, totalTruckCount, startIndex, endIndex };
}

function App() {
  const [searchType, setSearchType] = useState<SearchType>("Applicant");
  const [foodTrucks, setFoodTrucks] = useState<FoodTruck[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  /** Initial fetch of food trucks data and normalize the data so food items are displayed with commas for readibility. */
  useEffect(() => {
    fetchFoodTrucks()
      .then(foodTrucks =>
        foodTrucks.map((truck: FoodTruck) => ({
          ...truck,
          fooditems: (truck.fooditems ?? "")
            .split(":")
            .map((s: string) => s.trim())
            .filter(Boolean)
            .join(", "),
        }))
      )
      .then(setFoodTrucks)
      .catch(() => setErrorMessage("Failed to load food trucks"))
      .finally(() => setLoading(false));
  }, []);

  /** Include a debounce */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrPage(1);
    }, 300);
  
    return () => clearTimeout(handler);
  }, [search]);

  // Filter by applicant or address
  const filteredTrucks = foodTrucks.filter((t) => {
    const field =
      searchType === "Applicant"
        ? t.applicant
        : (t.address as string);
    const searchMatches = field.toLowerCase().includes(debouncedSearch.toLowerCase());
    const statusMatches = status === "All" || t.status.toLowerCase() === status.toLowerCase();
    return searchMatches && statusMatches;
  });

  /** Handles the search results */
  function onSearch(value: string) {
    setSearch(value);
    setCurrPage(1);
  }

  // Get the paginated food trucks and total pages
  const { totalPages, pageTrucks, totalTruckCount, startIndex, endIndex } = getPaginatedFoodTrucks(filteredTrucks, currPage);

  /** Loading state UI */
  if (isLoading) {
    return <div data-testid="loading-state" className="loading">Loading food trucks...</div>;
  }
  
  /** Error state UI */
  if (errorMessage) {
    return <div className="error">
      {errorMessage}
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>;
  }

  return (
    <div className="page-wrapper">

      <SearchBar
        searchType={searchType}
        onSelect={(option) => {
          setSearchType(option);
          setSearch("");
          setCurrPage(1);
        }}
        search={search}
        onSearch={onSearch}
      />

      <div className="filter-toolbar">
        <StatusFilter
          currentStatus={status}
          onSelect={(option) => {
            setStatus(option);
            setCurrPage(1);
          }}
        />
        <div className="truck-count" data-testid="truck-count">
          Showing {startIndex}–{endIndex} of {totalTruckCount}
        </div>
      </div>
      
      {/* The food trucks table to display */}
      <FoodTruckTable columns={columns} pageTrucks={pageTrucks} />

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          aria-label="Go to previous page"
          onClick={() => setCurrPage(Math.max(currPage - 1, 1))}
          disabled={currPage === 1}
          className="previous-button"
          data-testid="previous-button"
        >
          Previous
        </button>

        <span>
          Page {currPage} of {totalPages}
        </span>

        <button
          aria-label="Go to next page"
          className="next-button"
          onClick={() => setCurrPage(Math.min(currPage + 1, totalPages))}
          disabled={currPage === totalPages}
          data-testid="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;