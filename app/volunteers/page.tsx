"use client";
import { useEffect, useState } from "react";
import { fetchVolunteersData } from "../fetch";
import Modal from "./Modal"; // Import the Modal component
import { Column, useTable } from "react-table";
import React from "react";
import Stats from "./Stats";

interface Volunteer {
  VolunteerId: string;
  Name: string;
  EmailId: string;
  MobileNo: string;
  Pincode: string;
  UserId: string;
  Password: string;
  SNo?: string;
  Status: string;
}

const Volunteerspage = () => {
  const [volunteersData, setVolunteersData] = useState<Volunteer[]>([]); // Store API response
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer>(
    {} as Volunteer
  ); // Update type to Volunteer or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    setSelectedVolunteer({} as Volunteer);
  };
  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChangeSuccess = () => {
    closeModal();
    fetchVolunteers(); // Refetch jobs data
  };

  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const columns: Column<Volunteer>[] = React.useMemo(
    () => [
      {
        Header: "Sno",
        id: "rowIndex",
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      { Header: "Name", accessor: "Name" },
      { Header: "Mobile No", accessor: "MobileNo" },
      { Header: "Email Id", accessor: "EmailId" },
      { Header: "Pincode", accessor: "Pincode" },
      { Header: "User Id", accessor: "UserId" },
      { Header: "Password", accessor: "Password" },
      {
        Header: "Action",
        id: "view",
        Cell: ({ row }: { row: { original: Volunteer } }) => (
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
      {
        Header: "Stats",
        id: "stats",
        Cell: ({ row }: { row: { original: Volunteer } }) => (
          <button
            className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-400"
            onClick={() => {
              setIsStatsOpen(true);
              setSelectedVolunteer(row.original);
            }}
          >
            Stats
          </button>
        ),
      },
    ],
    []
  );

  const dataToRender = React.useMemo(() => {
    if (!searchQuery) return volunteersData;
    return volunteersData.filter((volunteer) =>
      Object.values(volunteer).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, volunteersData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: dataToRender,
    });
  const month = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className=" top-14 lg:top-0 relative">
      {!isStatsOpen && (
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
                Status: "0",
              })
            }
          >
            Add New Volunteer
          </button>
        </div>
      )}
      {!isStatsOpen && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, mobile or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {!isStatsOpen && (
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
          )}
        </div>
      )}
      {/* Modal */}
      {isStatsOpen && (
        <Stats
          volunteerID={selectedVolunteer.VolunteerId || ""}
          name={selectedVolunteer.Name || ""}
          mobile={selectedVolunteer.MobileNo || ""}
          month={month}
          setIsStatsOpen={setIsStatsOpen}
        />
      )}

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

export default Volunteerspage;
