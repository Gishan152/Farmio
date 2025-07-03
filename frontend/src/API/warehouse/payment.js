export const api = async (method, url, data = null) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Assumes JWT
  };
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);
  const response = await fetch(`https://farmio-api.com${url}`, options);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};