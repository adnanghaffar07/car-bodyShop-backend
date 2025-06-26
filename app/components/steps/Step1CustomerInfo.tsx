"use client";
import React from "react";
import { FormDataType } from "./../types"; // adjust the path as needed


interface Props {
  formData: FormDataType;
  updateFormData: (updatedData: Partial<FormDataType>) => void;
}
export default function Step1CustomerInfo({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.customerInfo?.fullName || ""}
        onChange={(e) =>
          updateFormData({
            customerInfo: {
              ...(formData.customerInfo || {}),
              fullName: e.target.value,
            },
          })
        }
        className="input"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.customerInfo?.email || ""}
        onChange={(e) =>
          updateFormData({
            customerInfo: {
              ...(formData.customerInfo || {}),
              email: e.target.value,
            },
          })
        }
        className="input"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.customerInfo?.phoneNumber || ""}
        onChange={(e) =>
          updateFormData({
            customerInfo: {
              ...(formData.customerInfo || {}),
              phoneNumber: e.target.value,
            },
          })
        }
        className="input"
      />
    </div>
  );
}
