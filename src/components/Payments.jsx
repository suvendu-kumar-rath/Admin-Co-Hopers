import React, { useState } from "react";
import { Box, Paper, Modal, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
  maxHeight: '80vh',
  overflow: 'auto',
});

const paymentsData = [
  {
    id: 1,
    name: "Ann Culhane",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "ann.culhane@example.com",
    currentMonth: "January 2025",
    currentPayment: "Paid",
    monthlyPayments: [
      { month: "January 2025", amount: 1500, status: "Paid", dueDate: "2025-01-05", paidDate: "2025-01-03" },
      { month: "December 2024", amount: 1500, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-02" },
      { month: "November 2024", amount: 1500, status: "Paid", dueDate: "2024-11-05", paidDate: "2024-11-04" },
      { month: "October 2024", amount: 1500, status: "Late", dueDate: "2024-10-05", paidDate: "2024-10-10" },
    ],
    spaceType: "Private Office",
    memberSince: "2024-08-15",
  },
  {
    id: 2,
    name: "Ahmad Rosser",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "ahmad.rosser@example.com",
    currentMonth: "January 2025",
    currentPayment: "Due",
    monthlyPayments: [
      { month: "January 2025", amount: 800, status: "Due", dueDate: "2025-01-05", paidDate: null },
      { month: "December 2024", amount: 800, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-03" },
      { month: "November 2024", amount: 800, status: "Paid", dueDate: "2024-11-05", paidDate: "2024-11-01" },
    ],
    spaceType: "Shared Desk",
    memberSince: "2024-09-20",
  },
  {
    id: 3,
    name: "Zain Calzoni",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "zain.calzoni@example.com",
    currentMonth: "January 2025",
    currentPayment: "Inactive",
    monthlyPayments: [
      { month: "January 2025", amount: 600, status: "Inactive", dueDate: "2025-01-05", paidDate: null },
      { month: "December 2024", amount: 600, status: "Unpaid", dueDate: "2024-12-05", paidDate: null },
      { month: "November 2024", amount: 600, status: "Paid", dueDate: "2024-11-05", paidDate: "2024-11-07" },
    ],
    spaceType: "Hot Desk",
    memberSince: "2024-07-10",
  },
  {
    id: 4,
    name: "Leo Stanton",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "leo.stanton@example.com",
    currentMonth: "January 2025",
    currentPayment: "Paid",
    monthlyPayments: [
      { month: "January 2025", amount: 2000, status: "Paid", dueDate: "2025-01-05", paidDate: "2025-01-01" },
      { month: "December 2024", amount: 2000, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-01" },
      { month: "November 2024", amount: 2000, status: "Paid", dueDate: "2024-11-05", paidDate: "2024-11-01" },
    ],
    spaceType: "Conference Room",
    memberSince: "2024-06-01",
  },
  {
    id: 5,
    name: "Kaiya Vetrov",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "kaiya.vetrov@example.com",
    currentMonth: "January 2025",
    currentPayment: "Due",
    monthlyPayments: [
      { month: "January 2025", amount: 1200, status: "Due", dueDate: "2025-01-05", paidDate: null },
      { month: "December 2024", amount: 1200, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-04" },
    ],
    spaceType: "Private Office",
    memberSince: "2024-11-15",
  },
  {
    id: 6,
    name: "Ryan Westervelt",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "ryan.westervelt@example.com",
    currentMonth: "January 2025",
    currentPayment: "Paid",
    monthlyPayments: [
      { month: "January 2025", amount: 800, status: "Paid", dueDate: "2025-01-05", paidDate: "2025-01-02" },
      { month: "December 2024", amount: 800, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-01" },
    ],
    spaceType: "Shared Desk",
    memberSince: "2024-10-01",
  },
  {
    id: 7,
    name: "Corey Stanton",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "corey.stanton@example.com",
    currentMonth: "January 2025",
    currentPayment: "Paid",
    monthlyPayments: [
      { month: "January 2025", amount: 600, status: "Paid", dueDate: "2025-01-05", paidDate: "2025-01-04" },
      { month: "December 2024", amount: 600, status: "Paid", dueDate: "2024-12-05", paidDate: "2024-12-05" },
    ],
    spaceType: "Hot Desk",
    memberSince: "2024-09-01",
  },
  {
    id: 8,
    name: "Adison Aminoff",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "adison.aminoff@example.com",
    currentMonth: "January 2025",
    currentPayment: "Due",
    monthlyPayments: [
      { month: "January 2025", amount: 1500, status: "Due", dueDate: "2025-01-05", paidDate: null },
      { month: "December 2024", amount: 1500, status: "Late", dueDate: "2024-12-05", paidDate: "2024-12-15" },
    ],
    spaceType: "Private Office",
    memberSince: "2024-08-01",
  },
  {
    id: 9,
    name: "Alfredo Aminoff",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...",
    mobile: "8567485158",
    email: "alfredo.aminoff@example.com",
    currentMonth: "January 2025",
    currentPayment: "Inactive",
    monthlyPayments: [
      { month: "January 2025", amount: 800, status: "Inactive", dueDate: "2025-01-05", paidDate: null },
      { month: "December 2024", amount: 800, status: "Unpaid", dueDate: "2024-12-05", paidDate: null },
    ],
    spaceType: "Shared Desk",
    memberSince: "2024-05-01",
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
  if (status === "Late") { bg = "#FFF3E0"; color = "#FF9800"; }
  if (status === "Unpaid") { bg = "#FFEBEE"; color = "#F44336"; }
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

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
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
        Monthly Payments - {paymentsData[0]?.currentMonth}
      </Typography>

      <StyledPaper>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#F5F6FA", textAlign: "left" }}>
              <th style={{ padding: "16px" }}></th>
              <th style={{ padding: "16px" }}>ID</th>
              <th style={{ padding: "16px" }}>NAME <span style={{color:'#bdbdbd'}}>↕</span></th>
              <th style={{ padding: "16px" }}>ADDRESS</th>
              <th style={{ padding: "16px" }}>CURRENT MONTH</th>
              <th style={{ padding: "16px" }}>AMOUNT</th>
              <th style={{ padding: "16px" }}>DETAILS</th>
              <th style={{ padding: "16px" }}>MOBILE</th>
              <th style={{ padding: "16px" }}>PAYMENT STATUS</th>
            </tr>
          </thead>
          <tbody>
            {paymentsData.map((member) => {
              const currentMonthPayment = member.monthlyPayments[0];
              return (
                <tr key={member.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "16px" }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: "16px" }}>{member.id}</td>
                  <td style={{ padding: "16px", fontWeight: 600 }}>{member.name}</td>
                  <td style={{ padding: "16px" }}>{member.address}</td>
                  <td style={{ padding: "16px" }}>{member.currentMonth}</td>
                  <td style={{ padding: "16px", fontWeight: 600 }}>${currentMonthPayment?.amount || 0}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button 
                      onClick={() => handleDetailsClick(member)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <EyeIcon />
                    </button>
                  </td>
                  <td style={{ padding: "16px" }}>{member.mobile}</td>
                  <td style={{ padding: "16px" }}><PaymentBadge status={member.currentPayment} /></td>
                </tr>
              );
            })}
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

      {/* Details Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {selectedUser && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                Payment Details & User Information
              </Typography>
              
              {/* User Details Section */}
              <Box sx={{ mb: 4, p: 3, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  User Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedUser.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Member Since:</Typography>
                    <Typography variant="body1">{new Date(selectedUser.memberSince).toLocaleDateString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Space Type:</Typography>
                    <Typography variant="body1">{selectedUser.spaceType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Mobile:</Typography>
                    <Typography variant="body1">{selectedUser.mobile}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body1">{selectedUser.email}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="body2" color="text.secondary">Address:</Typography>
                    <Typography variant="body1">{selectedUser.address}</Typography>
                  </Box>
                </Box>
              </Box>



              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Payments;
