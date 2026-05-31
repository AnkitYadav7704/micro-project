import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3000/api/students';

function App() {
  const [formData, setFormData] = useState({
    Roll_No: '',
    Full_Name: '',
    Class: '',
    Birth_Date: '',
    Address: '',
    Enrollment_Date: ''
  });

  const [formState, setFormState] = useState('INITIAL'); // 'INITIAL', 'NEW', 'EXISTS'
  const [students, setStudents] = useState([]);
  const rollNoRef = useRef(null);
  const fullNameRef = useRef(null);

  // Initialize form on mount
  useEffect(() => {
    resetForm();
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      Roll_No: '',
      Full_Name: '',
      Class: '',
      Birth_Date: '',
      Address: '',
      Enrollment_Date: ''
    });
    setFormState('INITIAL');
    setTimeout(() => {
      if (rollNoRef.current) {
        rollNoRef.current.focus();
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkPrimaryKey = async (e) => {
    // If Enter key pressed or onBlur triggered
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    if (!formData.Roll_No) return;
    
    // Prevent double execution
    if (formState !== 'INITIAL') return;

    try {
      const response = await axios.get(`${API_URL}/${formData.Roll_No}`);
      if (response.data.exists) {
        // Exists: show data, enable update/reset
        setFormData(response.data.data);
        setFormState('EXISTS');
      } else {
        // Does not exist: enable save/reset
        setFormState('NEW');
      }
      
      // Move cursor to next field
      setTimeout(() => {
        if (fullNameRef.current) {
          fullNameRef.current.focus();
        }
      }, 100);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data from server');
    }
  };

  const validateForm = () => {
    for (const key in formData) {
      if (!formData[key]) {
        alert(`${key.replace('_', ' ')} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      await axios.post(API_URL, formData);
      alert('Data saved successfully');
      resetForm();
      fetchAllStudents();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`${API_URL}/${formData.Roll_No}`, formData);
      alert('Data updated successfully');
      resetForm();
      fetchAllStudents();
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Enrollment Form</h2>
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <label className="form-label fw-bold">Roll No:</label>
            <input
              type="text"
              className="form-control"
              name="Roll_No"
              value={formData.Roll_No}
              onChange={handleInputChange}
              onBlur={checkPrimaryKey}
              onKeyDown={checkPrimaryKey}
              ref={rollNoRef}
              disabled={formState !== 'INITIAL'}
              placeholder="Enter Roll No and press Enter/Tab"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name:</label>
            <input
              type="text"
              className="form-control"
              name="Full_Name"
              value={formData.Full_Name}
              onChange={handleInputChange}
              ref={fullNameRef}
              disabled={formState === 'INITIAL'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Class:</label>
            <input
              type="text"
              className="form-control"
              name="Class"
              value={formData.Class}
              onChange={handleInputChange}
              disabled={formState === 'INITIAL'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Birth Date:</label>
            <input
              type="date"
              className="form-control"
              name="Birth_Date"
              value={formData.Birth_Date}
              onChange={handleInputChange}
              disabled={formState === 'INITIAL'}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address:</label>
            <input
              type="text"
              className="form-control"
              name="Address"
              value={formData.Address}
              onChange={handleInputChange}
              disabled={formState === 'INITIAL'}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Enrollment Date:</label>
            <input
              type="date"
              className="form-control"
              name="Enrollment_Date"
              value={formData.Enrollment_Date}
              onChange={handleInputChange}
              disabled={formState === 'INITIAL'}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={formState !== 'NEW'}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleUpdate}
              disabled={formState !== 'EXISTS'}
            >
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={formState === 'INITIAL'}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {students.length > 0 && (
        <div className="card shadow p-4 mx-auto mt-5">
          <h4 className="text-center mb-4">View All Registered Students</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Roll No</th>
                  <th>Full Name</th>
                  <th>Class</th>
                  <th>Birth Date</th>
                  <th>Address</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {students.map((val, index) => (
                  <tr key={index}>
                    <td>{val.Roll_No}</td>
                    <td>{val.Full_Name}</td>
                    <td>{val.Class}</td>
                    <td>{val.Birth_Date}</td>
                    <td>{val.Address}</td>
                    <td>{val.Enrollment_Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
