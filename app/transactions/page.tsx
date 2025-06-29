"use client";
import React, { useEffect, useState } from "react";
import { Column, useTable } from "react-table";
import { fetchTransactionsData } from "../fetch";

interface Worker {
  SNo: string;
  UserId: string;
  TransactionId: string;
  Amount: string;
  PaymentStatus: string;
  Remarks: string;
  Date: string;
  PaymentStatusText: string;
  FormattedDate: string;
}

const TransactionsPage = () => {
  const [workersData, setTransactionsData] = useState<Worker[]>([]); // Store API response
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const data = await fetchTransactionsData();
      const filteredData = data.data || [];
      setTransactionsData(filteredData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns: Column<Worker>[] = React.useMemo(
    () => [
      {
        Header: "Sno",
        id: "rowIndex",
        Cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },

      { Header: "User Id", accessor: "UserId" },
      { Header: "Transaction Id", accessor: "TransactionId" },
      { Header: "Amount", accessor: "Amount" },
      {
        Header: "Payment Status",
        accessor: "PaymentStatus",
        Cell: ({ row }: { row: { original: Worker } }) =>
          row.original.PaymentStatus === "0"
            ? "Failed"
            : row.original.PaymentStatus === "1"
            ? "Successful"
            : "Pending",
      },
      { Header: "Remarks", accessor: "Remarks" },

      { Header: "Payment Date", accessor: "FormattedDate" },
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

  return (
    <div className=" top-14 lg:top-0 relative">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">View Transactions</h1>
      </div>
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
    </div>
  );
};

export default TransactionsPage;
