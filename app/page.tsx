"use client";
import React, { useState } from "react";
import TopVolunteers from "./TopVolunteers";
import Notification from "./Notification";

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <h1 className="text-2xl mb-6">Abhi Hire admin dashboard</h1>
      <div className=" flex flex-wrap gap-5 justify-between text-center">
        <div className=" flex flex-wrap gap-5 ">
          <a
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            href="/volunteers"
          >
            Volunteers{" "}
          </a>
          <a
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            href="/workers"
          >
            Workers{" "}
          </a>
          <a
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            href="/contractors"
          >
            Contractors{" "}
          </a>
          <a
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            href="/works"
          >
            All Works{" "}
          </a>
          <a
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            href="/transactions"
          >
            Transactions{" "}
          </a>
        </div>

        <div>
          <button
            className=" p-2 bg-blue-500 font-bold text-white w-40"
            onClick={() => setIsModalOpen(true)}
          >
            Send Notification
          </button>
          {isModalOpen && (
            <Notification
              key={isModalOpen ? "open" : "closed"} // forces remount
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(!isModalOpen)}
            />
          )}
        </div>
      </div>
      <TopVolunteers />
    </div>
  );
};

export default Homepage;
