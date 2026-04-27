import React, { useState, useEffect } from "react";
import { Box, Typography, Modal, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { membersApi } from '../api/members';

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

const PastMembers = () => {
  const [pastMembersData, setPastMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
      <>
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
          {pastMembersData.length === 0 ? (
            <tr>
              <td colSpan={12} style={{ padding: "32px", textAlign: "center", color: "#888" }}>
                No past members found.
              </td>
            </tr>
          ) : pastMembersData.map((member, index) => (
            <tr key={member.id || index} style={{ borderBottom: "1px solid #F0F0F0" }}>
              <td style={{ padding: "12px" }}>
                <input type="checkbox" />
              </td>
              <td style={{ padding: "12px" }}>{member.id}</td>
              <td style={{ padding: "12px" }}>
                <div style={{ fontWeight: 600 }}>{member.name || member.username || member.full_name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{member.phone || member.mobile}</div>
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
                  {member.spaceType || member.space_type || member.space_name || '—'}
                </span>
              </td>
              <td style={{ padding: "12px" }}>{member.start || member.start_date}</td>
              <td style={{ padding: "12px" }}>{member.end || member.end_date}</td>
              <td style={{ padding: "12px", fontWeight: 600 }}>{member.unit || member.unit_number}</td>
              <td style={{ padding: "12px" }}>{member.amount || member.total_amount}</td>
              <td style={{ padding: "12px" }}>{member.mail || member.email}</td>
              <td style={{ padding: "12px", fontSize: "12px", color: "#666" }}>
                {member.contactDetails || `${member.phone || member.mobile || ''} ${member.mail || member.email || ''}`.trim() || '—'}
              </td>
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
      </>
      )}

      {/* KYC Details Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {selectedMember && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                KYC Details - {selectedMember.name || selectedMember.username || selectedMember.full_name}
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
                        ...getKycStatusColor(selectedMember.kyc?.status || selectedMember.kyc_status),
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {selectedMember.kyc?.status || selectedMember.kyc_status || 'N/A'}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Type:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc?.idType || selectedMember.id_type || '—'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Number:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc?.idNumber || selectedMember.id_number || '—'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Date of Birth:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc?.dateOfBirth || selectedMember.date_of_birth
                        ? new Date(selectedMember.kyc?.dateOfBirth || selectedMember.date_of_birth).toLocaleDateString()
                        : '—'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Nationality:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc?.nationality || selectedMember.nationality || '—'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Occupation:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc?.occupation || selectedMember.occupation || '—'}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc?.verificationDate || selectedMember.verification_date
                        ? new Date(selectedMember.kyc?.verificationDate || selectedMember.verification_date).toLocaleDateString()
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
