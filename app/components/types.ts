// app/components/types.ts

export interface CustomerInfo {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  createdBy?: string;
}

export interface VehicleInfo {
  manufacturer?: string;
  type?: string;
  model?: string;
  year?: number;
  vin?: string;
  licenceNumber?: string;
  color?: string;
}

export interface InsuranceInfo {
  company?: string;
  policyNumber?: string;
  expiryDate?: string;
  isCoverageValid?: boolean;
}

export interface FormDataType {
  customerInfo?: CustomerInfo;
  vehicleInfo?: VehicleInfo;
  insuranceInfo?: InsuranceInfo;
}
