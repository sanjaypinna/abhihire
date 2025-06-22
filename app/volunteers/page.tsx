"use client";
import { useEffect, useState } from "react";
import { fetchVolunteersData } from "../fetch";
import Modal from "./Modal"; // Import the Modal component

interface Volunteer {
  VolunteerId: string;
  Name: string;
  EmailId: string;
  MobileNo: string;
  Pincode: string;
  UserId: string;
  Password: string;
}

const Volunteerspage = () => {
  const [volunteersData, setVolunteersData] = useState<Volunteer[]>([]); // Store API response
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  ); // Update type to Volunteer or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchVolunteers = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const data = await fetchVolunteersData();
      const filteredData = data.data || [];
      setVolunteersData(filteredData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch
    }
  };

  const openModal = (job: Volunteer) => {
    setSelectedVolunteer(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVolunteer(null);
  };
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChangeSuccess = () => {
    closeModal();
    fetchVolunteers(); // Refetch jobs data
  };

  return (
    <div className=" top-14 lg:top-0 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Volunteers List</h1>
        <button
          className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600 mt-2"
          onClick={() =>
            openModal({
              VolunteerId: "",
              Name: "",
              EmailId: "",
              MobileNo: "",
              Pincode: "",
              UserId: "",
              Password: "",
            })
          }
        >
          Add New Volunteer
        </button>
      </div>

      {/* Content for the active tab */}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteersData.length > 0 ? (
            volunteersData.map((volunteer) => (
              <VolunteerCard
                key={volunteer.VolunteerId}
                item={volunteer}
                onView={() => openModal(volunteer)}
              />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}
      {/* Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          volunteer={selectedVolunteer}
          onStatusChangeSuccess={handleStatusChangeSuccess}
        />
      )}
    </div>
  );
};

const VolunteerCard = ({
  item,
  onView,
}: {
  item: Volunteer;
  onView: () => void;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col items-center gap-2">
      <h2 className="text-lg font-bold">{item.Name}</h2>
      <p className="text-sm">{item.EmailId}</p>
      <p className="text-sm">{item.MobileNo}</p>
      <button
        onClick={onView}
        className="bg-blue-400 text-white font-bold px-3 py-1 rounded hover:bg-blue-600 mt-2"
      >
        Update
      </button>
    </div>
  );
};

export default Volunteerspage;
