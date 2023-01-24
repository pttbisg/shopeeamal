export interface IGetWarehouseDetailResponse {
  request_id: string;
  error?: string;
  message?: string;
  response: Array<{
    warehouse_id: number;
    warehouse_name: string;
    location_id: string;
    country: string;
    state: string;
    city: string;
    district: string;
    town: string;
    address: string;
    zipcode: string;
    state_code: string;
    holiday_mode_status: number;
  }>;
}
