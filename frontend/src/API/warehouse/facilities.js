export const fetchFacilities = async () => {
  const response = await fetch('/api/warehouse/facilities', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch facilities');
  return response.json();
};

export const addFacility = async (data) => {
  const response = await fetch('/api/warehouse/facilities', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add facility');
  return response.json();
};

export const updateFacility = async (id, data) => {
  const response = await fetch(`/api/warehouse/facilities/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update facility');
  return response.json();
};

export const deleteFacility = async (id) => {
  const response = await fetch(`/api/warehouse/facilities/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to delete facility');
};