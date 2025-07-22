import React, { useState } from "react";
import { Box, Typography, Modal, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
  maxHeight: '80vh',
  overflow: 'auto',
});

const pastMembersData = [
  {
    id: 1,
    name: "Ann Culhane",
    phone: "5684236526",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Private Office",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236526, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P1234567',
      dateOfBirth: '1990-05-15',
      nationality: 'American',
      occupation: 'Software Engineer',
      verificationDate: '2024-12-15'
    }
  },
  {
    id: 2,
    name: "Ahmad Rosser",
    phone: "5684236527",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Shared Desk",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236527, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Driver License',
      idNumber: 'DL987654',
      dateOfBirth: '1988-03-22',
      nationality: 'Canadian',
      occupation: 'Designer',
      verificationDate: '2024-11-20'
    }
  },
  {
    id: 3,
    name: "Zain Calzoni",
    phone: "5684236528",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Hot Desk",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236528, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'National ID',
      idNumber: 'NID456789',
      dateOfBirth: '1992-11-08',
      nationality: 'British',
      occupation: 'Marketing Manager',
      verificationDate: '2024-10-15'
    }
  },
  {
    id: 4,
    name: "Leo Stanton",
    phone: "5684236529",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Meeting Room",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236529, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P7654321',
      dateOfBirth: '1985-07-12',
      nationality: 'Australian',
      occupation: 'Consultant',
      verificationDate: '2024-09-22'
    }
  },
  {
    id: 5,
    name: "Kaiya Vetrov",
    phone: "5684236530",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Private Office",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236530, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Driver License',
      idNumber: 'DL123456',
      dateOfBirth: '1993-09-25',
      nationality: 'German',
      occupation: 'Data Analyst',
      verificationDate: '2024-11-05'
    }
  },
  {
    id: 6,
    name: "Ryan Westervelt",
    phone: "5684236531",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Shared Desk",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236531, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P9876543',
      dateOfBirth: '1991-12-03',
      nationality: 'French',
      occupation: 'Product Manager',
      verificationDate: '2024-08-18'
    }
  },
  {
    id: 7,
    name: "Corey Stanton",
    phone: "5684236532",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Hot Desk",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236532, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'National ID',
      idNumber: 'NID789123',
      dateOfBirth: '1989-04-17',
      nationality: 'Spanish',
      occupation: 'Web Developer',
      verificationDate: '2024-10-30'
    }
  },
  {
    id: 8,
    name: "Adison Aminoff",
    phone: "5684236533",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Conference Room",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236533, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Driver License',
      idNumber: 'DL567890',
      dateOfBirth: '1987-08-30',
      nationality: 'Italian',
      occupation: 'Business Analyst',
      verificationDate: '2024-07-12'
    }
  },
  {
    id: 9,
    name: "Alfredo Aminoff",
    phone: "5684236534",
    address: "Lorem ipsum elit. Nulla...",
    spaceType: "Private Office",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
    contactDetails: "Phone: 5684236534, Email: sbdhbi@136gmail.com",
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P5432109',
      dateOfBirth: '1994-01-14',
      nationality: 'Dutch',
      occupation: 'UX Designer',
      verificationDate: '2024-09-08'
    }
  },
];

const PastMembers = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleKycDetailsClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'Verified': return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'Pending': return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      case 'Rejected': return { backgroundColor: '#FFEBEE', color: '#D32F2F' };
      default: return { backgroundColor: '#F5F5F5', color: '#757575' };
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", margin: "24px 0" }}>
      {/* Header with filter and search */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <button style={{
          border: "none",
          background: "#F5F6FA",
          borderRadius: "8px",
          width: "36px",
          height: "36px",
          marginRight: "12px",
          cursor: "pointer"
        }}>
          <span role="img" aria-label="filter">🔽</span>
        </button>
        <input
          type="text"
          placeholder="Search..."
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #E0E0E0",
            background: "#F5F6FA"
          }}
        />
      </div>
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr style={{ background: "#F5F6FA", textAlign: "left" }}>
            <th style={{ padding: "12px" }}></th>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>NAME</th>
            <th style={{ padding: "12px" }}>ADDRESS</th>
            <th style={{ padding: "12px" }}>SPACE TYPE</th>
            <th style={{ padding: "12px" }}>START</th>
            <th style={{ padding: "12px" }}>END</th>
            <th style={{ padding: "12px" }}>UNIT</th>
            <th style={{ padding: "12px" }}>AMOUNT</th>
            <th style={{ padding: "12px" }}>MAIL</th>
            <th style={{ padding: "12px" }}>CONTACT DETAILS</th>
            <th style={{ padding: "12px" }}>KYC DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {pastMembersData.map((member) => (
            <tr key={member.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
              <td style={{ padding: "12px" }}>
                <input type="checkbox" />
              </td>
              <td style={{ padding: "12px" }}>{member.id}</td>
              <td style={{ padding: "12px" }}>
                <div style={{ fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{member.phone}</div>
              </td>
              <td style={{ padding: "12px" }}>{member.address}</td>
              <td style={{ padding: "12px" }}>
                <span style={{
                  background: "#F0F8FF",
                  color: "#1E40AF",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500
                }}>
                  {member.spaceType}
                </span>
              </td>
              <td style={{ padding: "12px" }}>{member.start}</td>
              <td style={{ padding: "12px" }}>{member.end}</td>
              <td style={{ padding: "12px", fontWeight: 600 }}>{member.unit}</td>
              <td style={{ padding: "12px" }}>{member.amount}</td>
              <td style={{ padding: "12px" }}>{member.mail}</td>
              <td style={{ padding: "12px", fontSize: "12px", color: "#666" }}>{member.contactDetails}</td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                <button 
                  onClick={() => handleKycDetailsClick(member)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <VisibilityIcon style={{ color: '#4CAF50', fontSize: 20 }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
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
      </div>

      {/* KYC Details Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {selectedMember && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                KYC Details - {selectedMember.name}
              </Typography>
              
              <Box sx={{ mb: 4, p: 3, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Status:
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 2, 
                        py: 0.5, 
                        borderRadius: 2,
                        ...getKycStatusColor(selectedMember.kyc.status),
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {selectedMember.kyc.status}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Type:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc.idType}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Number:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc.idNumber}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Date of Birth:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedMember.kyc.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Nationality:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.nationality}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Occupation:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.occupation}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.verificationDate 
                        ? new Date(selectedMember.kyc.verificationDate).toLocaleDateString()
                        : 'Not verified yet'}
                    </Typography>
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
    </div>
  );
};

export default PastMembers;
