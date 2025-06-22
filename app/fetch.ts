// fetch.ts
export const fetchVolunteersData = async () => {
  const response = await fetch("/api/volunteers");
  const data = await response.json(); // The data is already parsed as JSON
  return data;
};

