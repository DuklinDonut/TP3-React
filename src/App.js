import React, { useState, useEffect } from 'react';
import CreateIntern from './components/createIntern';
import UpdateIntern from './components/updateIntern';
import Login from './components/login';

export default function App() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status on initial load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch interns if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInterns();
    }
  }, [isAuthenticated]);

  const fetchInterns = async () => {
    try {
        const response = await fetch('http://localhost:8080/students', {
            credentials: 'include', // Ensure session cookies are sent
        });

        // Check if the response is JSON, if not, handle it accordingly
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Expected JSON response but received HTML or other content. Check login status.");
        }

        if (!response.ok) throw new Error('Failed to fetch interns');
        const data = await response.json();
        setInterns(data);
    } catch (error) {
        console.error('Error fetching interns:', error);
    }
};

  // Login handler
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchInterns(); // Fetch data immediately after successful login
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Check login status to maintain session
  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/loginStatus', {
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsAuthenticated(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setInterns([]);
        setSelectedIntern(null);
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle create intern
  const handleCreateIntern = async (values) => {
    try {
      const queryParams = new URLSearchParams({
        firstName: values.firstName,
        lastName: values.lastName,
        title: values.stageTitle,
        description: values.stageDescription,
      });

      const response = await fetch(`http://localhost:8080/students/byTitle?${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to create intern');
      const newIntern = await response.json();
      setInterns((prev) => [...prev, newIntern]);
    } catch (error) {
      console.error('Error creating intern:', error);
    }
  };

  // Handle delete intern
  const handleDeleteIntern = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/students/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete intern');
      setInterns((prev) => prev.filter((intern) => intern.id !== id));
    } catch (error) {
      console.error('Error deleting intern:', error);
    }
  };

  // Handle update intern
  const handleUpdateIntern = async (updatedIntern) => {
    try {
      const response = await fetch(`http://localhost:8080/students/update/${updatedIntern.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: updatedIntern.firstName,
          lastName: updatedIntern.lastName,
          stage: { id: updatedIntern.stage.id },
        }),
      });

      if (!response.ok) throw new Error('Failed to update intern');

      const updatedData = await response.json();
      setInterns((prev) =>
        prev.map((intern) => (intern.id === updatedData.id ? updatedData : intern))
      );
      setSelectedIntern(null);
      console.log('Student updated successfully');
    } catch (error) {
      console.error('Error updating intern:', error);
    }
  };

  return (
    <div className="container">
      <h1>Intern Management</h1>

      {isAuthenticated ? (
        <>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          
          <h2>List of Interns</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Stage Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((intern) => (
                <tr key={intern.id}>
                  <td>{intern.firstName}</td>
                  <td>{intern.lastName}</td>
                  <td>{intern.stage ? intern.stage.title : 'No Stage'}</td>
                  <td>
                    <button onClick={() => setSelectedIntern(intern)} className="btn btn-secondary">
                      Update
                    </button>
                    <button onClick={() => handleDeleteIntern(intern.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Add New Intern</h2>
          <CreateIntern onSubmit={handleCreateIntern} />

          {selectedIntern && (
            <>
              <h2>Update Intern</h2>
              <UpdateIntern
                intern={selectedIntern}
                onUpdate={(updatedIntern) => {
                  setInterns((prev) => prev.map((intern) => (intern.id === updatedIntern.id ? updatedIntern : intern)));
                  setSelectedIntern(null);
                }}
              />
            </>
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
