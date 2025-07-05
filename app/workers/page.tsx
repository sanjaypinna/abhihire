"use client";
import { useEffect, useState } from "react";
import { fetchWorkersData } from "../fetch";
import Modal from "./Modal";
import { Column, useTable } from "react-table";
import React from "react";
import { CSVLink } from "react-csv";

interface Worker {
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
  WorkCategoryName: string;
  DOB: string;
  Experience: string;
  WorkerId?: string;
}

const Workerspage = () => {
  const [workersData, setWorkersData] = useState<Worker[]>([]); // Store API response
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null); // Update type to Worker or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const columns: Column<Worker>[] = React.useMemo(
    () => [
      {
        Header: "Sno",
        id: "rowIndex",
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },

      { Header: "Name", accessor: "Name" },
      { Header: "MobileNo", accessor: "MobileNo" },
      { Header: "Work Category", accessor: "WorkCategoryName" },
      { Header: "WorkerId", accessor: "WorkerId" },

      {
        Header: "Verification Status",
        accessor: "VerificationStatus",
        Cell: ({ row }: { row: { original: Worker } }) =>
          row.original.VerificationStatus === "1"
            ? "Subscribed"
            : row.original.VerificationStatus === "2"
            ? "Not Subscribed"
            : "Expired",
      },
      {
        Header: "Action",
        id: "view",
        Cell: ({ row }: { row: { original: Worker } }) => (
          <button
            className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-400"
            onClick={() => {
              openModal(row.original);
            }}
          >
            Update
          </button>
        ),
      },
    ],
    []
  );

  const dataToRender = React.useMemo(() => {
    if (!searchQuery) return workersData;
    return workersData.filter((worker) =>
      Object.values(worker).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, workersData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: dataToRender,
    });

  const headers = [
    { label: "Sno", key: "Sno" },
    { label: "Name", key: "Name" },
    { label: "MobileNo", key: "MobileNo" },
    { label: "WorkerId", key: "WorkerId" },
    { label: "Work Category", key: "Work Category" },
    { label: "Pincode", key: "Pincode" },
    { label: "Verification Status", key: "Verification Status" },
  ];

  const csvData = workersData.map((row, index) => ({
    Sno: index + 1,
    Name: row.Name,
    MobileNo: row.MobileNo,
    WorkerId: row.WorkerId,
    "Work Category": row.WorkCategoryName,
    Pincode: row.Pincode,
    "Verification Status":
      row.VerificationStatus === "1"
        ? "Subscribed"
        : row.VerificationStatus === "2"
        ? "Not Subscribed"
        : "Expired",
  }));

  const csvReport = {
    data: csvData,
    headers: headers,
    filename: "workers.csv",
  };

  return (
    <div className=" top-14 lg:top-0 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">View Workers</h1>
      </div>
      <div className="w-full mb-4">
        <div className="flex gap-2 items-center justify-between flex-wrap">
          <input
            type="text"
            placeholder="Search by name, mobile or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
          />
          <button className="bg-green-400 text-white font-bold px-3 py-1 rounded hover:bg-green-600 mt-2">
            <CSVLink {...csvReport}>Export</CSVLink>
          </button>
        </div>
      </div>
      <div className="flex  mb-6 gap-4 text-center items-end flex-wrap justify-between ">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table
              {...getTableProps()}
              className="min-w-full bg-white border rounded-lg border-gray-200"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        key={column.id}
                        className="text-left p-2 border-b border-gray-200"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.value}
                          className="p-2 border-b border-gray-200"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

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

export default Workerspage;
