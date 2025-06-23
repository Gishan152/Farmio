import React from "react";

const MaintenanceRequestCard = ({ request }) => (
  <div className="maintenance-request-card border-gray bg-light" style={{ padding: '1rem', marginBottom: '1rem' }}>
    <h3 className="primary-green">{request.title}</h3>
    <p className="text-dark">{request.description}</p>
    <p>Status: <span className={request.status === 'open' ? 'status-red' : 'status-green'}>{request.status}</span></p>
  </div>
);

export default MaintenanceRequestCard;