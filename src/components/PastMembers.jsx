import React from "react";
// Optional: for custom styles

const pastMembersData = [
  {
    id: 1,
    name: "Ann Culhane",
    phone: "5684236526",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 2,
    name: "Ahmad Rosser",
    phone: "5684236527",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 3,
    name: "Zain Calzoni",
    phone: "5684236528",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 4,
    name: "Leo Stanton",
    phone: "5684236529",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 5,
    name: "Kaiya Vetrov",
    phone: "5684236530",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 6,
    name: "Ryan Westervelt",
    phone: "5684236531",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 7,
    name: "Corey Stanton",
    phone: "5684236532",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 8,
    name: "Adison Aminoff",
    phone: "5684236533",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
  {
    id: 9,
    name: "Alfredo Aminoff",
    phone: "5684236534",
    address: "Lorem ipsum elit. Nulla...",
    start: "1 JAN 2025",
    end: "1 JAN 2025",
    unit: "605",
    amount: "5158",
    mail: "sbdhbi@136gmail.com",
  },
];

const PastMembers = () => {
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
            <th style={{ padding: "12px" }}>START</th>
            <th style={{ padding: "12px" }}>END</th>
            <th style={{ padding: "12px" }}>UNIT</th>
            <th style={{ padding: "12px" }}>AMOUNT</th>
            <th style={{ padding: "12px" }}>MAIL</th>
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
              <td style={{ padding: "12px" }}>{member.start}</td>
              <td style={{ padding: "12px" }}>{member.end}</td>
              <td style={{ padding: "12px", fontWeight: 600 }}>{member.unit}</td>
              <td style={{ padding: "12px" }}>{member.amount}</td>
              <td style={{ padding: "12px" }}>{member.mail}</td>
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
    </div>
  );
};

export default PastMembers;
