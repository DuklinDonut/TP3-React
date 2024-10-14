import React from 'react';
import { useEffect, useState } from 'react';

function DeleteIntern() {
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    // Fetch interns
    fetch('http://localhost:8080/students')
      .then(response => response.json())
      .then(data => setInterns(data))
      .catch(error => console.error('Error fetching interns:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/students/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setInterns(interns.filter(intern => intern.id !== id));
          console.log(`Intern with id ${id} deleted successfully`);
        } else {
          console.error('Failed to delete intern:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting intern:', error));
  };

  return (
    <div>
      <h1>Liste des Internes</h1>
      <ul>
        {interns.map(intern => (
          <li key={intern.id}>
            {intern.firstName} {intern.lastName} 
            <button onClick={() => handleDelete(intern.id)} className="btn btn-danger">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteIntern;
