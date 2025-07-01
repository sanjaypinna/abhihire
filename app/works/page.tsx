"use client";
import { useEffect, useState } from "react";
import { fetchWorksData } from "../fetch";
import Modal from "./Modal";
import { Column, useTable } from "react-table";
import React from "react";
interface Work {
  Name: string;
  MobileNo: string;
  Place: string;
  Pincode: string;
  SNo: string;
  Status: number;
  WorkCategoryName: string;
  WorkId: string;
  DatePosted: string;
  PostedBy: string;
  District: string;
  State: string;
  Description: string;
  UserName: string;
  ContractorId?: string;
}

const Works = () => {
  const [workData, setWorkData] = useState<Work[]>([]); // Store API response
  const [selectedWorker, setSelectedWorker] = useState<Work | null>(null); // Update type to Worker or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorkers = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const data = await fetchWorksData();
      const filteredData = data.data || [];
      setWorkData(filteredData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch
    }
  };

  const openModal = (job: Work) => {
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

  const columns: Column<Work>[] = React.useMemo(
    () => [
      {
        Header: "Sno",
        id: "rowIndex",
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      { Header: "Contractor Code", accessor: "ContractorId" },
      { Header: "Contractor Name", accessor: "Name" },
      { Header: "MobileNo", accessor: "MobileNo" },
      { Header: "Work Name", accessor: "WorkCategoryName" },
      { Header: "Pincode", accessor: "Pincode" },
      { Header: "Date Posted", accessor: "DatePosted" },
      {
        Header: "Action",
        id: "view",
        Cell: ({ row }: { row: { original: Work } }) => (
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
    if (!searchQuery) return workData;
    return workData.filter((work) =>
      Object.values(work).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, workData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: dataToRender,
    });
  return (
    <div className=" top-14 lg:top-0 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">View Works </h1>
      </div>

      {/* Content for the active tab */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search by name, mobile or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex  mb-6 gap-4 text-center items-end flex-wrap justify-between ">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table
            {...getTableProps()}
            className="min-w-full bg-white border rounded-lg border-gray-200"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
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

export default Works;
