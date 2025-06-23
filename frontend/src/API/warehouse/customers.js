// Mock API call for customers
export async function fetchCustomers() {
  // Replace with real API call if needed
  return [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Corp",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Globex Inc",
    },
  ];
}