// Modal.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import toast

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: {
    VolunteerId: string;
    Name: string;
    EmailId: string;
    MobileNo: string;
    Pincode: string;
    UserId: string;
    Password: string;
    Status: string;
  }; // Add any other details you want to display
  onStatusChangeSuccess: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  volunteer,
  onStatusChangeSuccess,
}) => {
  const [volunteerData, setVolunteerData] =
    useState<ModalProps["volunteer"]>(volunteer);

  useEffect(() => {
    setVolunteerData(volunteer);
  }, [volunteer]);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          VolunteerId: volunteerData.VolunteerId,
          Name: volunteerData.Name,
          EmailId: volunteerData.EmailId,
          MobileNo: volunteerData.MobileNo,
          Pincode: volunteerData.Pincode,
          UserId: volunteerData.UserId,
          Password: volunteerData.Password,
        }),
      });
      const result = await response.json();
      if (result?.status === 200) {
        toast.success("Volunteer updated successfully!");
        onStatusChangeSuccess();
      } else {
        toast.error(result?.message || "Failed to update volunteer.");
      }
    } catch (error) {
      toast.error("Failed to add volunteer.");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("/api/addVolunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: volunteerData.Name,
          EmailId: volunteerData.EmailId,
          MobileNo: volunteerData.MobileNo,
          Pincode: volunteerData.Pincode,
          UserId: volunteerData.UserId,
          Password: volunteerData.Password,
        }),
      });

      const result = await response.json();
      if (result?.status === 200) {
        toast.success("volunteer added successfully!");
        onStatusChangeSuccess();
      } else {
        toast.error(result?.message || "Failed to add volunteer.");
      }
    } catch (error) {
      toast.error("Failed to add volunteer.");
    }
  };

  const handleBlock = async (Status: string) => {
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: volunteerData.Name,
          EmailId: volunteerData.EmailId,
          MobileNo: volunteerData.MobileNo,
          Pincode: volunteerData.Pincode,
          UserId: volunteerData.UserId,
          Password: volunteerData.Password,
          Status: Status,
        }),
      });
      const result = await response.json();
      if (result?.status === 200) {
        toast.success("Volunteer blocked successfully!");
        onStatusChangeSuccess();
      } else {
        toast.error(result?.message || "Failed to block volunteer.");
      }
    } catch (error) {
      toast.error("Failed to block volunteer.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="gap-2 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto  flex flex-col justify-between"
        style={{ maxHeight: "90%", backgroundColor: "white" }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Name</label>
            <input
              type="text"
              defaultValue={volunteer.Name}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, Name: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Email</label>
            <input
              type="text"
              defaultValue={volunteer.EmailId}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, EmailId: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Mobile</label>
            <input
              type="text"
              defaultValue={volunteer.MobileNo}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, MobileNo: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Pincode</label>
            <input
              type="text"
              defaultValue={volunteer.Pincode}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, Pincode: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">UserId</label>
            <input
              type="text"
              defaultValue={volunteer.UserId}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, UserId: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Password</label>
            <input
              type="text"
              defaultValue={volunteer.Password}
              onChange={(e) =>
                setVolunteerData({ ...volunteerData, Password: e.target.value })
              }
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2 justify-center">
          <button
            className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600 mt-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600 mt-2"
            onClick={() => {
              volunteer.VolunteerId ? handleUpdate() : handleAdd();
            }}
          >
            {volunteer.VolunteerId ? "Update" : "Add"}
          </button>
          {volunteer.VolunteerId && volunteer.Status == "0" && (
            <button
              className="bg-green-500 text-white font-bold px-3 py-1 mt-2 rounded hover:bg-green-600"
              onClick={() => handleBlock("1")}
            >
              Block
            </button>
          )}
          {volunteer.VolunteerId && volunteer.Status == "1" && (
            <button
              className="bg-red-500 text-white font-bold px-3 py-1 mt-2 rounded hover:bg-red-600"
              onClick={() => handleBlock("0")}
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
