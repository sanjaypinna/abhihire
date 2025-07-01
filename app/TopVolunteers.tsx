"use client";

import React, { useEffect, useState } from "react";
import { fetchTopVolunteersData } from "./fetch";
import { Column, useTable } from "react-table";

interface Volunteers {
  name: string;
  mobile: string;
  total_all: number;
  total_subscribed: number;
  total_not_subscribed: number;
}

const TopVolunteers = () => {
  const [volunteersData, setVolunteersData] = useState<Volunteers[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopVolunteersData();
      const filteredData = (data.data || []).filter(
        (item: Volunteers) =>
          item.name &&
          typeof item.name === "string" &&
          item.mobile &&
          typeof item.mobile === "string"
      );
      setVolunteersData(filteredData);
    } catch (error) {
      console.error("Error fetching top volunteers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const columns: Column<Volunteers>[] = React.useMemo(() => [
    {
      Header: "Sno",
      id: "rowIndex",
      Cell: ({ row }) => row.index + 1,
    },
    { Header: "Name", accessor: "name" },
    { Header: "MobileNo", accessor: "mobile" },
    { Header: "Total All", accessor: "total_all" },
    { Header: "Total Subscribed", accessor: "total_subscribed" },
    { Header: "Total Unsubscribed", accessor: "total_not_subscribed" },
  ], []); 
  
  const dataToRender = React.useMemo(() => {
    if (!searchQuery.trim()) return volunteersData;
    const q = searchQuery.toLowerCase();
    return volunteersData.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.mobile.toLowerCase().includes(q) ||
        v.total_all.toString().includes(q) ||
        v.total_subscribed.toString().includes(q) ||
        v.total_not_subscribed.toString().includes(q)
    );
  }, [searchQuery, volunteersData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: dataToRender,
    });

  return (
    <div className="mt-10 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Top Volunteers</h1>
      </div>
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search by name or mobile or total all or total subscribed or total unsubscribed..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex mb-6 gap-4 text-center items-end flex-wrap justify-between">
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
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={`${cell.column.id}-${row.id}`}
                          className="p-2 border-b border-gray-200"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TopVolunteers;
