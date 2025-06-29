import { useEffect, useState } from "react";

interface StatsProps {
  volunteerID: string;
  month: string;
  name: string;
  mobile: string;
  setIsStatsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OverallStats {
  workers: {
    total: {
      count: number;
      subscribed: number;
      not_subscribed: number;
    };
  };
  contractors: {
    total: {
      count: number;
      subscribed: number;
      not_subscribed: number;
    };
  };
}

interface MonthlyStats {
  data: {
    day_name: string;
    total_count: number;
    subscribed: number;
    not_subscribed: number;
  }[];
}

const Stats: React.FC<StatsProps> = ({
  volunteerID,
  month,
  name,
  mobile,
  setIsStatsOpen,
}: StatsProps) => {
  const [overallStats, setOverallStats] = useState<OverallStats>({
    workers: {
      total: {
        count: 0,
        subscribed: 0,
        not_subscribed: 0,
      },
    },
    contractors: {
      total: {
        count: 0,
        subscribed: 0,
        not_subscribed: 0,
      },
    },
  });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    data: [],
  });
  const [isOverallLoading, setIsOverallLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);

  const fetchOverallStats = async () => {
    try {
      const response = await fetch("/api/overallStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteer_id: volunteerID,
        }),
      });
      const result = await response.json();
      setOverallStats(result);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchStats = async ({ month }: { month: string }) => {
    try {
      const response = await fetch("/api/monthlyStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteer_id: volunteerID,
          month: month,
        }),
      });
      const result = await response.json();
      setMonthlyStats(result);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchOverallStats();
    setIsOverallLoading(false);
  }, []);

  useEffect(() => {
    fetchStats({ month });
    setIsMonthlyLoading(false);
  }, [volunteerID, month]);

  console.log(overallStats.contractors, monthlyStats);

  const options = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const currentMonthIndex = new Date().getMonth(); // 0-based index (0 = Jan)
  const last6Months = [...Array(6)]
    .map((_, i) => {
      const index = (currentMonthIndex - i + 12) % 12;
      return options[index];
    })
    .reverse(); // To show from oldest to newest

  const [selectedMonth, setSelectedMonth] = useState(month);

  const handleMonthChange = (selectedOption: string) => {
    fetchStats({ month: selectedOption });
    setSelectedMonth(selectedOption);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Volunteer Work Analysis</h1>
        <button
          onClick={() => setIsStatsOpen(false)}
          className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-400"
        >
          Go back
        </button>
      </div>

      {isOverallLoading ? (
        <p>Loading...</p>
      ) : (
        <div className=" flex flex-col justify-center items-center">
          <div className="flex flex-col gap-4 justify-center overflow-y-auto py-4 ">
            <div className="flex gap-4 items-center">
              <p className="font-semibold  w-40">Volunteer Name:</p>
              <p>{name}</p>
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-semibold w-40">MobileNo:</p>
              <p>{mobile}</p>
            </div>
          </div>
          <div className=" flex items-center mt-5 justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <p>Total Contractors Added</p>
              <p>{overallStats.contractors.total.count}</p>
              <p>Subscribed: {overallStats.contractors.total.subscribed}</p>
              <p>
                Not Subscribed: {overallStats.contractors.total.not_subscribed}
              </p>
            </div>
            <hr className="h-[125px] w-[2px]  bg-gray-300" />
            <div className="flex flex-col items-center gap-2">
              <p>Total Workers Added</p>
              <p>{overallStats.workers.total.count}</p>
              <p>Subscribed: {overallStats.workers.total.subscribed}</p>
              <p>Not Subscribed: {overallStats.workers.total.not_subscribed}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-10">
        <p>Select Month</p>
        <select
          onChange={(e) => handleMonthChange(e.target.value)}
          value={selectedMonth}
          className="w-40 h-10"
        >
          {last6Months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      {isMonthlyLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4 items-center pt-10">
          {monthlyStats &&
            monthlyStats.data.map((item, index) => (
              <div
                key={index}
                className="shadow-lg flex flex-col items-center gap-2 p-4"
              >
                <p>{item.day_name} </p>
                <p>{item.total_count}</p>
                <p>Sub:{item.subscribed}</p>
                <p>Not Sub:{item.not_subscribed}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default Stats;
