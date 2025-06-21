import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-farmio-dark">Moderator Dashboard</h1>
      <p className="mb-4">Welcome to the Farmio Moderator Dashboard</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-farmio text-white rounded-md hover:bg-farmio-dark"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ModeratorDashboard;
