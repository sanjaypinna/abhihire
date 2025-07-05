// Modal.tsx
import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const notificationData = {
    topic: "",
    title: "",
    description: "",
    type: "general",
  };

  const [inputData, setInputData] = useState(notificationData);

  const options = [
    {
      label: "All",
      value: "ABHIREALL",
    },
    {
      label: "Worker",
      value: "Worker",
    },
    {
      label: "Volunteer",
      value: "volunteer",
    },
    {
      label: "Contractor",
      value: "contractor",
    },
  ];

  const handleSendNotification = async () => {
    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: inputData.topic,
          title: inputData.title,
          content: inputData.description,
          type: inputData.type,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update status: ${response.status} ${response.statusText}`
        );
      }
      toast.success("Notification sent successfully!"); // Show success toast
      onClose();
      setInputData(notificationData);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to send notification."); // Show error toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="gap-2 p-6 rounded-lg shadow-lg w-full max-w-xl overflow-auto  flex flex-col justify-between"
        style={{ maxHeight: "90%", backgroundColor: "white" }}
      >
        <h1>Send Notification</h1>
        <hr />
        <div className="flex gap-2 justify-center">
          {options.map((option) => (
            <div key={option.value}>
              <button
                id={option.value}
                className={`px-4 py-2 my-3 border-2 border-blue-300 font-bold w-fit h-fit ${
                  inputData.topic === option.value ? "bg-blue-300" : "bg-white"
                }`}
                onClick={() =>
                  setInputData({ ...inputData, topic: option.value })
                }
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 items-start">
          <span className="text-sm font-bold">Notification Title*</span>
          <input
            type="text"
            name="title"
            defaultValue={inputData.title}
            onChange={(e) =>
              setInputData({ ...inputData, title: e.target.value })
            }
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>

        <div className="flex flex-col gap-1 items-start">
          <span className="text-sm font-bold">Description*</span>
          <textarea
            name="description"
            value={inputData.description}
            className="border border-gray-300 rounded w-full p-2"
            onChange={(e) =>
              setInputData({ ...inputData, description: e.target.value })
            }
          />
        </div>
        <div className="mt-4 flex space-x-2 justify-center">
          <button
            className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-600"
            onClick={() => handleSendNotification()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
