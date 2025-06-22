// fetch.ts
export const fetchVolunteersData = async () => {
  const response = await fetch("/api/volunteers");
  const data = await response.json(); // The data is already parsed as JSON
  return data;
};

export const fetchWorkersData = async () => {
  const response = await fetch("/api/workers");
  const data = await response.json(); // The data is already parsed as JSON
  return data;
};

export const fetchContractorsData = async () => {
  const response = await fetch("/api/contractors");
  const data = await response.json(); // The data is already parsed as JSON
  return data;
};

export const fetchWorksData = async () => {
  const response = await fetch("/api/allworkers");
  const data = await response.json(); // The data is already parsed as JSON
  return data;
};
