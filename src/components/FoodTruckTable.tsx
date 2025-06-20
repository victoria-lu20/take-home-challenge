import { FoodTruck } from "../api";

type FoodTruckColumn = {
  label: string;
  key: string;
}

/**
 * The food truck table to display.
 * @param columns - The header columns, with label and key.
 * @param pageTrucks - The food trucks to render on each page.
 */
export function FoodTruckTable({ columns, pageTrucks }: { columns: FoodTruckColumn[], pageTrucks: FoodTruck[] }) {
  return (
    <div className="table-wrapper">
      <table className="food-truck-table" aria-label="Food Truck Table">
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageTrucks.map((foodTruck) => (
            <tr key={foodTruck.objectid} data-testid={`food-truck-row-${foodTruck.objectid}`}>
              <td>{foodTruck.applicant}</td>
              <td>{foodTruck.facilitytype}</td>
              <td>{foodTruck.fooditems}</td>
              <td>{foodTruck.address}</td>
              <td>{foodTruck.status}</td>
              <td>{foodTruck.permit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}