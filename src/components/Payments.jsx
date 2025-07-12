import React from "react";
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  padding: '24px',
  marginLeft: '250px',
});

const StyledPaper = styled(Paper)({
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const paymentsData = [
  {
    id: 1,
    name: "Ann Culhane",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Paid",
  },
  {
    id: 2,
    name: "Ahmad Rosser",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Due",
  },
  {
    id: 3,
    name: "Zain Calzoni",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Inactive",
  },
  {
    id: 4,
    name: "Leo Stanton",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Inactive",
  },
  {
    id: 5,
    name: "Kaiya Vetrov",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Due",
  },
  {
    id: 6,
    name: "Ryan Westervelt",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Paid",
  },
  {
    id: 7,
    name: "Corey Stanton",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Paid",
  },
  {
    id: 8,
    name: "Adison Aminoff",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Due",
  },
  {
    id: 9,
    name: "Alfredo Aminoff",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    payment: "Inactive",
  },
];

const EyeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10" stroke="#3B82F6" strokeWidth="2" fill="#E8F0FE" />
    <circle cx="11" cy="11" r="3" fill="#3B82F6" />
  </svg>
);

const PaymentBadge = ({ status }) => {
  let bg = "#E0F7E9", color = "#34A853";
  if (status === "Due") { bg = "#FDE8E8"; color = "#EA4335"; }
  if (status === "Inactive") { bg = "#E8EAF6"; color = "#757575"; }
  return (
    <span style={{
      background: bg,
      color,
      borderRadius: "8px",
      padding: "4px 16px",
      fontWeight: 500,
      fontSize: "14px"
    }}>{status}</span>
  );
};

const Payments = () => {
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <button style={{
          border: 'none',
          background: '#F5F6FA',
          borderRadius: '8px',
          width: '36px',
          height: '36px',
          marginRight: '12px',
          cursor: 'pointer'
        }}>
          <span role="img" aria-label="filter">🔽</span>
        </button>
        <input
          type="text"
          placeholder="Search..."
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #E0E0E0',
            background: '#F5F6FA'
          }}
        />
      </Box>
      <StyledPaper>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#F5F6FA", textAlign: "left" }}>
              <th style={{ padding: "16px" }}></th>
              <th style={{ padding: "16px" }}>ID</th>
              <th style={{ padding: "16px" }}>NAME <span style={{color:'#bdbdbd'}}>↕</span></th>
              <th style={{ padding: "16px" }}>ADDRESS</th>
              <th style={{ padding: "16px" }}>DETAILS</th>
              <th style={{ padding: "16px" }}>MOBILE</th>
              <th style={{ padding: "16px" }}>PAYMENT</th>
            </tr>
          </thead>
          <tbody>
            {paymentsData.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: "16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "16px" }}>{member.id}</td>
                <td style={{ padding: "16px", fontWeight: 600 }}>{member.name}</td>
                <td style={{ padding: "16px" }}>{member.address}</td>
                <td style={{ padding: "16px", textAlign: "center" }}><EyeIcon /></td>
                <td style={{ padding: "16px" }}>{member.mobile}</td>
                <td style={{ padding: "16px" }}><PaymentBadge status={member.payment} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          fontSize: "14px",
          color: "#888"
        }}>
          <span>1-10 of 97</span>
          <div>
            <button style={{
              border: "none",
              background: "#F5F6FA",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              marginRight: "4px",
              cursor: "pointer"
            }}>{'<'}</button>
            <button style={{
              border: "none",
              background: "#F5F6FA",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              marginLeft: "4px",
              cursor: "pointer"
            }}>{'>'}</button>
          </div>
          <span>Rows per page: 10 ▼ &nbsp; 1/10</span>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Payments;
