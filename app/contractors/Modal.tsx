// Modal.tsx
import React from "react";
import { toast } from "react-toastify"; // Import toast
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: {
    Name: string;
    Email: string;
    MobileNo: string;
    Pincode: string;
    SNo: string;
    Status: number;
    Image: string;
    Street: string;
    City: string;
    State: string;
    Country: string;
    Area: string;
    District: string;
    VerificationStatus: string;
    SubscriptionEndingDate: string;
    AddedDate: string;
  }; // Add any other details you want to display
  onStatusChangeSuccess: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  contractor,
  onStatusChangeSuccess,
}) => {
  if (!isOpen) return null;

  const handleStatusChange = async (SNo: string, Status: number) => {
    try {
      const response = await fetch("/api/contractors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SNo: SNo,
          Status: Status,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to update status: ${response.status} ${response.statusText}`
        );
      }
      toast.success("Status updated successfully!"); // Show success toast
      onStatusChangeSuccess();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status."); // Show error toast
    }
  };

  const Data = [
    {
      label: "Name",
      value: contractor.Name,
    },
    {
      label: "Mobile No",
      value: contractor.MobileNo,
    },
    {
      label: "Email",
      value: contractor.Email,
    },
    {
      label: "Street",
      value: contractor.Street,
    },
    {
      label: "Area",
      value: contractor.Area,
    },
    {
      label: "Pincode",
      value: contractor.Pincode,
    },
    {
      label: "District",
      value: contractor.District,
    },
    {
      label: "State",
      value: contractor.State,
    },
    {
      label: "Subscription Status",
      value:
        contractor.VerificationStatus === "1"
          ? "Subscribed"
          : contractor.VerificationStatus === "2"
          ? "Not Subscribed"
          : "Expired",
    },
    {
      label: "Subscription Ending Date",
      value: contractor.SubscriptionEndingDate,
    },
    {
      label: "Joined Date",
      value: contractor.AddedDate,
    },
  ];
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="gap-2 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto  flex flex-col justify-between"
        style={{ maxHeight: "90%", backgroundColor: "white" }}
      >
        <div className="flex flex-col gap-2 w-full overflow-y-auto p-4 max-h-[60vh]">
          {contractor.Image && (
            <img src={contractor.Image} width={150} height={150} className="m-auto" alt="logo" />
          )}
          {Data.map((item, index) => (
            <div className="flex gap-2" key={index}>
              <p className="basis-1/4 font-semibold min-w-[140px]">
                {item.label}:
              </p>
              <p className="basis-3/4">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2 justify-center">
          <button
            className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
          {contractor.Status == 0 && (
            <button
              className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-600"
              onClick={() => handleStatusChange(contractor.SNo, 1)}
            >
              Block
            </button>
          )}
          {contractor.Status == 1 && (
            <button
              className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleStatusChange(contractor.SNo, 0)}
            >
              Unblock
            </button>
          )}
        </div>
      </div>
      {/* Buttons */}
    </div>
  );
};

export default Modal;
