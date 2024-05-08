import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  // State variables to store student data and selected student for update
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ names: '', address: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to fetch all students from the backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Function to handle form submission for adding a new student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/students', newStudent);
      fetchStudents();
      setNewStudent({ names: '', address: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // Function to handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Function to handle delete a student by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      // Refresh student data after deleting the student
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Function to handle selecting a student for update
  const handleSelect = (student) => {
    setSelectedStudent(student);
  };

  // Function to handle updating a student by ID
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/students/${selectedStudent.id}`, selectedStudent);
      fetchStudents();
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);
  console.log(students)

  return (
    <div className="App">
      <h1>Student List</h1>
      {/* Form to add a new student */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="names" value={newStudent.names} onChange={handleChange} placeholder="Enter names" />
        <input type="text" name="address" value={newStudent.address} onChange={handleChange} placeholder="Enter address" />
        <button type="submit">Add Student</button>
      </form>
      {/* Display list of students in a table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Names</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.names}</td>
              <td>{student.address}</td>
              <td>
                <button onClick={() => handleSelect(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Form to update a selected student */}
      {selectedStudent && (
        <div>
          <h2>Edit Student</h2>
          <form onSubmit={handleUpdate}>
            <input type="text" name="names" value={selectedStudent.names} onChange={(e) => setSelectedStudent({ ...selectedStudent, names: e.target.value })} />
            <input type="text" name="address" value={selectedStudent.address} onChange={(e) => setSelectedStudent({ ...selectedStudent, address: e.target.value })} />
            <button type="submit">Update</button>
            <button onClick={() => setSelectedStudent(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
