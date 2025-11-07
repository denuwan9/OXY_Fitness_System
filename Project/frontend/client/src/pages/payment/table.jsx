import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaArrowLeft } from "react-icons/fa";
import "./table.css"; // custom styles

export default function EManageEmp() {
  const [Info, setInfo] = useState([]);
  const [DId, setformId] = useState("");
  const [filter, setfilter] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchinfo = async () => {
      try {
        const res = await fetch(`http://localhost:6017/api/payment/pget`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchinfo();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Records Report", 20, 20);
  
    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);
  
    // Table headers
    const headers = [
      "Card Holder",
      "Card Type",
      "Card Number",
      "Expiry",
      "CSV",
      "Package"
    ];
  
    // Table rows from Info
    const tableData = Info.map((item) => [
      item.cardHolderName,
      item.cardType,
      "**** **** **** ****", // Masked
      "****",               // Masked expiryMonth
      "***",                // Masked CSV
      item.itemname
    ]);
    
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255] },
      styles: { fontSize: 10, halign: "center" },
      margin: { horizontal: 20 }
    });
  
    const lineY = doc.autoTable.previous.finalY + 10;
  
    doc.setFontSize(10);
    doc.text("Report generated from EManageEmp records.", 20, lineY);
  
    doc.save("payment-records.pdf");
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`http://localhost:6017/api/payment/pdelete/${DId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setInfo((prev) => prev.filter((course) => course._id !== DId));
        alert("Deleted");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (query.trim() === "") {
      setfilter([...Info]);
    } else {
      const filteredData = Info.filter(
        (course) =>
          course.cardHolderName &&
          course.cardHolderName.toLowerCase().includes(query.toLowerCase())
      );
      setfilter(filteredData);
    }
  }, [query, Info]);

  return (
    <div className="page-background">
      <div className="gradient-overlay"></div>

      <div className="container3">
        <input
          type="text"
          placeholder="Search..."
          className="search-box"
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="action-buttons">
          <button onClick={generatePDF} className="button">
            Report
          </button>
          <Link to={`/eadd`}>
            <button className="button">New Record</button>
          </Link>
        </div>

        <Link to={`/profile`} className="link-back">
          <FaArrowLeft style={{ marginRight: "8px" }} />
          Go back
        </Link>

        <div className="card3-container">
          {filter && filter.length > 0 ? (
            filter.map((course) => (
              <div key={course._id} className="card3">
                <div className="mb-4">
                  <h3 className="title">{course.cardHolderName}</h3>
                  <p>*****************</p>
                </div>
                <p>Package: {course.itemname}</p>
                <p>Card Type: {course.cardType}</p>
                <p>Card Number: **** **** **** ****</p>
                <p>Expiry Month: ******</p>
                <p>CSV: ***</p>

                <div className="actions">
                  <Link to={`/eupdate/${course._id}`}>
                    <button className="button edit-btn" >Edit</button>
                  </Link>
                  <button
                    onClick={() => {
                      setformId(course._id);
                      handleDeleteUser();
                    }}
                    className="button delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-center py-4">No records found</div>
          )}
        </div>
      </div>
    </div>
  );
}
