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

const pastMembersData = [
  // ... existing data ...
];

const PastMembers = () => {
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
              <th style={{ padding: "16px" }}>NAME</th>
              <th style={{ padding: "16px" }}>ADDRESS</th>
              <th style={{ padding: "16px" }}>START</th>
              <th style={{ padding: "16px" }}>END</th>
              <th style={{ padding: "16px" }}>UNIT</th>
              <th style={{ padding: "16px" }}>AMOUNT</th>
              <th style={{ padding: "16px" }}>MAIL</th>
            </tr>
          </thead>
          <tbody>
            {pastMembersData.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: "16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "16px" }}>{member.id}</td>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontWeight: 600 }}>{member.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{member.phone}</div>
                </td>
                <td style={{ padding: "16px" }}>{member.address}</td>
                <td style={{ padding: "16px" }}>{member.start}</td>
                <td style={{ padding: "16px" }}>{member.end}</td>
                <td style={{ padding: "16px", fontWeight: 600 }}>{member.unit}</td>
                <td style={{ padding: "16px" }}>{member.amount}</td>
                <td style={{ padding: "16px" }}>{member.mail}</td>
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

export default PastMembers; 