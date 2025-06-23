// Mock API call for maintenance requests
export async function fetchMaintenanceRequests() {
  // Replace with real API call if available
  return [
    {
      id: 1,
      title: "Leaky Roof",
      description: "Water is leaking from the roof in section B.",
      status: "open",
    },
    {
      id: 2,
      title: "Broken Light",
      description: "Light not working in storage area.",
      status: "closed",
    },
  ];
}