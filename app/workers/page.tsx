"use client";
import { useEffect, useState } from "react";
import { fetchWorkersData } from "../fetch";
import Modal from "./Modal";

interface Worker {
  Name: string;
  EmailId: string;
  MobileNo: string;
  Pincode: string;
  UserId: string;
  Password: string;
  SNo: string;
  Status: number;
}

const Workerspage = () => {
  const [volunteersData, setWorkersData] = useState<Worker[]>([]); // Store API response
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null); // Update type to Worker or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWorkers = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const data = await fetchWorkersData();
      const filteredData = data.data || [];
      setWorkersData(filteredData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch
    }
  };

  const openModal = (job: Worker) => {
    setSelectedWorker(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };
  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleStatusChangeSuccess = () => {
    closeModal();
    fetchWorkers(); // Refetch jobs data
  };

  return (
    <div className=" top-14 lg:top-0 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Workers List</h1>
      </div>

      {/* Content for the active tab */}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteersData.length > 0 ? (
            volunteersData.map((volunteer) => (
              <WorkerCard
                key={volunteer.SNo}
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
      {selectedWorker && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          worker={selectedWorker}
          onStatusChangeSuccess={handleStatusChangeSuccess}
        />
      )}
    </div>
  );
};

const WorkerCard = ({ item, onView }: { item: Worker; onView: () => void }) => {
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

export default Workerspage;
