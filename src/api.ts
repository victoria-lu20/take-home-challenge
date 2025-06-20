
const DATA_URL = "https://data.sfgov.org/resource/rqzj-sfat.json";

export async function fetchFoodTrucks() {
  // Fetch the response from the database
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();

  } catch (err) {
    throw err;
  }
}

export type FoodTruck = {
  /** The location id of the facility */
  objectid: string;
  
  /** Name of permit holder */
  applicant: string;

  /** Type of facility permitted: truck or push cart */
  facilitytype: string;

  /** CNN of street segment or intersection location */
  cnn: number;

  /** Description of street segment or intersection location */
  locationdescription?: string;

  /** Address */
  address: string;

  /** Block lot (parcel) number */
  blocklot: string;

  /** Block number */
  block: string;

  /** Lot number */
  lot: string;

  /** Permit number */
  permit: string;

  /** Status of permit: approved or requested */
  status: string;

  /** A description of food items sold */
  fooditems: string;

  /** CA State Plane III */
  x: string;

  /** CA State Plane III */
  y: string;

  /** Latitude of food truck */
  latitude?: number;

  /** Longitude of food truck */
  longitude?: number;

  /** URL link to schedule for facility */
  schedule: string;

  /** Abbreviated text of schedule */
  dayshours: string;

  /** Expiration date */
  expirationdate: string;
};