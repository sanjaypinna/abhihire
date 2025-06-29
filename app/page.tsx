import React from "react";

const Homepage = () => {
  return (
    <div>
      <h1 className="text-2xl mb-6">Abhi Hire admin dashboard</h1>
      <div className=" flex flex-wrap gap-5 text-center">
        <div className=" flex gap-5 ">
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
        </div>
        <div className=" flex gap-5">
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
      </div>
    </div>
  );
};

export default Homepage;
