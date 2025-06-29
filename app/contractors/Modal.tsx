// Modal.tsx
import React from "react";
import { toast } from "react-toastify"; // Import toast
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
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
  worker,
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
      value: worker.Name,
    },
    {
      label: "Mobile No",
      value: worker.MobileNo,
    },
    {
      label: "Email",
      value: worker.Email,
    },
    {
      label: "Street",
      value: worker.Street,
    },
    {
      label: "Area",
      value: worker.Area,
    },
    {
      label: "Pincode",
      value: worker.Pincode,
    },
    {
      label: "District",
      value: worker.District,
    },
    {
      label: "State",
      value: worker.State,
    },
    {
      label: "Subscription Status",
      value:
        worker.VerificationStatus === "1"
          ? "Subscribed"
          : worker.VerificationStatus === "2"
          ? "Not Subscribed"
          : "Expired",
    },
    {
      label: "Subscription Ending Date",
      value: worker.SubscriptionEndingDate,
    },
    {
      label: "Joined Date",
      value: worker.AddedDate,
    },
  ];
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="gap-2 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto  flex flex-col justify-between"
        style={{ maxHeight: "90%", backgroundColor: "white" }}
      >
        <div className="flex flex-col gap-2 w-full overflow-y-auto p-4 max-h-[60vh]">
          {worker.Image && (
            <img src={worker.Image} width={62} height={62} alt="logo" />
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
          {worker.Status == 0 && (
            <button
              className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-600"
              onClick={() => handleStatusChange(worker.SNo, 1)}
            >
              Block
            </button>
          )}
          {worker.Status == 1 && (
            <button
              className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleStatusChange(worker.SNo, 0)}
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
