import React from "react";

const CustomerCard = ({ customer }) => (
  <div className="customer-card border-gray bg-light" style={{ padding: '1rem', marginBottom: '1rem' }}>
    <h3 className="primary-green">{customer.name}</h3>
    <p className="text-dark">{customer.email}</p>
    <p>{customer.company}</p>
  </div>
);

export default CustomerCard;