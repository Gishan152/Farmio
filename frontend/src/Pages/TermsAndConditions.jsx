import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0f8f0',
            border: '1px solid #2c5530',
            borderRadius: '8px',
            color: '#2c5530',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2c5530';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f0f8f0';
            e.target.style.color = '#2c5530';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
          Back
        </button>

        <h1 style={{
          fontSize: '2.5rem',
          color: '#2c5530',
          textAlign: 'center',
          marginBottom: '0.5rem',
          fontWeight: '700'
        }}>Terms and Conditions</h1>
        
        <h2 style={{
          fontSize: '1.2rem',
          color: '#5a7c65',
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: '400',
          fontStyle: 'italic'
        }}>Farmio - Connecting Agricultural Stakeholders</h2>
        
        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>1. Introduction</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Welcome to Farmio. These Terms and Conditions govern your use of our platform and services. 
            By accessing or using Farmio, you agree to be bound by these terms.
          </p>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Farmio is an integrated digital platform connecting Farmers, Buyers, Transport Providers, 
            Warehouse Owners, Waste Management Agents, Moderators, and System Administrators to streamline 
            the agricultural supply chain in Sri Lanka.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>2. Information Sharing Policy</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            To facilitate the proper functioning of our platform, certain information will be shared between users:
          </p>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            <strong style={{ color: '#2c5530', fontWeight: '600' }}>Contact Information Sharing:</strong> When you register as a user on Farmio, you acknowledge 
            and consent that your contact details (including but not limited to name, business name, email address, 
            phone number, and location) will be shared with other registered users on our platform to facilitate 
            business transactions, communications, and logistics coordination. Farmers cannot view Transport Providers' 
            or Warehouse Owners' contact numbers until payment for the respective service is completed.
          </p>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            <strong style={{ color: '#2c5530', fontWeight: '600' }}>Third-Party Restriction:</strong> We will NOT share your personal information with third parties 
            outside of the Farmio ecosystem for marketing purposes or sell your data to external organizations 
            without your explicit consent.
          </p>
          
          <h4 style={{
            fontSize: '1.1rem',
            color: '#4a6741',
            margin: '1.5rem 0 1rem 0',
            fontWeight: '600'
          }}>Specific Information Sharing by User Type:</h4>
          <ul style={{
            margin: '1rem 0',
            paddingLeft: '2rem'
          }}>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Farmers:</strong> Farm location, crop types, quantity, availability, and contact details will be visible to Buyers, Transport Providers, Warehouse Owners, and Waste Management Agents after relevant payments are made.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Buyers:</strong> Business information, purchase requirements, and contact details will be visible to Farmers, Transport Providers, and Warehouse Owners.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Transport Providers:</strong> Service availability, vehicle details, and contact information will be visible to Farmers, Buyers, and Warehouse Owners only after payment confirmation.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Warehouse Owners:</strong> Storage facility details, capacity, pricing, and contact information will be visible to Farmers, Buyers, and Transport Providers after payment confirmation.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Waste Management Agents:</strong> Available waste types, pickup schedules, and contact details will be visible to Farmers and Transport Providers.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Moderators and System Administrators:</strong> Access user data solely for platform management, complaint handling, and ensuring policy compliance.
            </li>
          </ul>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>3. User Responsibilities</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>All users are responsible for:</p>
          <ul style={{
            margin: '1rem 0',
            paddingLeft: '2rem'
          }}>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Providing accurate and up-to-date information during registration and profile management.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Using the platform in accordance with applicable laws and regulations in Sri Lanka.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Maintaining the confidentiality of their account credentials.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Respecting the privacy and rights of other users.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Reporting any suspicious or unauthorized activities to Farmio moderators or administrators.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Ensuring timely communication and updates regarding orders, transport, or storage bookings.</li>
          </ul>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>4. Privacy Protection</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Farmio is committed to protecting your privacy. We implement reasonable security measures, 
            including industry-standard encryption technologies, to protect against unauthorized access, 
            alteration, disclosure, or destruction of data. Our platform uses JWT-based authentication 
            and role-based access controls to ensure secure user interactions.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>5. Escrow-Based Payments</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Farmio integrates secure escrow-based payment mechanisms via PayHere. Payments are held securely 
            and released to sellers or service providers only upon buyer confirmation of order or service 
            fulfillment, ensuring trust and fairness in transactions. No refunds are available for payments 
            made to Transport Providers or for goods purchased, as they involve live goods shared through the platform.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>6. Platform Features and Usage</h3>
          <ul style={{
            margin: '1rem 0',
            paddingLeft: '2rem'
          }}>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Crop Listing and Search:</strong> Farmers can list crops without including transport prices, specifying details such as type, quantity, quality, and expected price. Buyers can search based on location, price, category, or freshness.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Order Placement and Matching:</strong> When a Buyer purchases multiple items from the same Farmer in a single transaction, all items are consolidated under one order. The platform suggests Transport Providers and Warehouse Owners for seamless order fulfillment.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Transport and Warehouse Booking:</strong> Farmers or Buyers can schedule logistics and reserve storage facilities through the platform. Warehouse bookings require a mandatory additional 3-day period beyond the booked date. Users must pay for these extra 3 days upfront; if the stored items are retrieved on or before the original booked date, the additional payment is refunded.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Circular Waste Management:</strong> Farmers can post agricultural waste, and Waste Management Agents can claim and schedule pickups.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Messaging and Notifications:</strong> Real-time in-app chat and notifications keep users updated on orders, payments, and logistics.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Rating and Review System:</strong> Users can rate and review other stakeholders based on their experiences.
            </li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>
              <strong style={{ color: '#2c5530', fontWeight: '600' }}>Complaint Handling:</strong> Moderators address user complaints and ensure compliance with platform policies.
            </li>
          </ul>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>7. Modifications to Terms</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Farmio reserves the right to modify these terms at any time. We will notify users of significant 
            changes via email or platform notifications. Your continued use of the platform following such 
            changes constitutes your acceptance of the modified terms.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>8. Limitation of Liability</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>Farmio is not responsible for:</p>
          <ul style={{
            margin: '1rem 0',
            paddingLeft: '2rem'
          }}>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>The quality or condition of goods listed on the platform, as no refunds are provided for purchased goods due to their perishable nature.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Disputes arising from transactions or interactions between users.</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Losses due to third-party service failures (e.g., payment gateways or logistics providers).</li>
            <li style={{
              marginBottom: '0.8rem',
              color: '#555'
            }}>Any direct, indirect, or consequential damages arising from platform use.</li>
          </ul>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>9. Termination</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            Farmio reserves the right to suspend or terminate user accounts for violations of these terms, 
            including but not limited to providing false information, engaging in fraudulent activities, 
            or violating the rights of other users.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>10. Governing Law</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>
            These Terms and Conditions are governed by the laws of Sri Lanka. Any disputes arising from 
            the use of the Farmio platform will be subject to the jurisdiction of Sri Lankan courts.
          </p>
        </section>

        <section style={{
          marginBottom: '2.5rem',
          padding: '1rem 0'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: '#2c5530',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #e8f5e8',
            fontWeight: '600'
          }}>11. Contact Us</h3>
          <p style={{
            marginBottom: '1rem',
            textAlign: 'justify',
            color: '#444'
          }}>If you have any questions about these Terms and Conditions, please contact us at:</p>
          <div style={{
            backgroundColor: '#f0f8f0',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #2c5530',
            marginTop: '1rem'
          }}>
            <p style={{
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              <strong style={{ color: '#2c5530' }}>Email:</strong> support@farmio.lk
            </p>
            <p style={{
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>
              <strong style={{ color: '#2c5530' }}>Phone:</strong> (+94) 11 2345678
            </p>
          </div>
        </section>

        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{
            color: '#777',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>Last updated: July 20, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;