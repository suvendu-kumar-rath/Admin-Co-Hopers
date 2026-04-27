import React, { useState, useEffect } from "react";
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { membersApi } from '../api/members';

const Container = styled(Box)(({ theme }) => ({
  padding: '24px',
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    padding: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const StyledPaper = styled(Paper)({
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const PastMembers = () => {
  const [pastMembersData, setPastMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await membersApi.fetchPastMembers();
        const data = response?.data || response || [];
        setPastMembersData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch past members:', err);
        setError(err.message || 'Failed to load past members');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
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
            {pastMembersData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                  No past members found.
                </td>
              </tr>
            ) : pastMembersData.map((member, index) => (
              <tr key={member.id || index} style={{ borderBottom: "1px solid #F0F0F0" }}>
                <td style={{ padding: "16px" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ padding: "16px" }}>{member.id}</td>
                <td style={{ padding: "16px" }}>
                  <div style={{ fontWeight: 600 }}>{member.name || member.username || member.full_name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{member.phone || member.mobile}</div>
                </td>
                <td style={{ padding: "16px" }}>{member.address}</td>
                <td style={{ padding: "16px" }}>{member.start || member.start_date}</td>
                <td style={{ padding: "16px" }}>{member.end || member.end_date}</td>
                <td style={{ padding: "16px", fontWeight: 600 }}>{member.unit || member.space_name}</td>
                <td style={{ padding: "16px" }}>{member.amount || member.total_amount}</td>
                <td style={{ padding: "16px" }}>{member.mail || member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
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