import React, { useState, useEffect } from 'react';
import CreateIntern from './components/createIntern'; // Importation du composant pour créer un stagiaire
import UpdateIntern from './components/updateIntern'; // Importation du composant pour mettre à jour un stagiaire
import DeleteIntern from './components/deleteIntern'; // Importation du composant pour supprimer un stagiaire

function FilterableInternTable({ interns, onUpdate, onDelete }) {
  const [filterText, setFilterText] = useState('');

  return (
    <div>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <InternTable interns={interns} filterText={filterText} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}

function InternRow({ intern, onUpdate, onDelete }) {
  const { firstName, lastName, stage, id } = intern;

  const handleDelete = async () => {
    // Call the delete function passed via props
    await onDelete(id);
  };

  return (
    <tr>
      <td>{firstName} {lastName}</td>
      <td>{stage ? stage.title : 'Aucun stage'}</td>
      <td>{stage ? stage.description : 'N/A'}</td>
      <td>
        <button 
          className="btn btn-secondary" 
          onClick={() => onUpdate(intern)}
        >
          Modifier
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleDelete}
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}

function InternTable({ interns, filterText, onUpdate, onDelete }) {
  const rows = [];

  interns.forEach((intern) => {
    if (intern.firstName.toLowerCase().indexOf(filterText.toLowerCase()) === -1 &&
        intern.lastName.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }

    rows.push(
      <InternRow intern={intern} key={intern.id} onUpdate={onUpdate} onDelete={onDelete} />
    );
  });

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Nom Complet</th>
          <th>Titre du Stage</th>
          <th>Description du Stage</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <form className="form-inline">
      <input 
        type="text" 
        className="form-control"
        value={filterText} 
        placeholder="Rechercher un stagiaire..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </form>
  );
}

export default function App() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null); // State to manage the selected intern for update

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await fetch('http://localhost:8080/students');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInterns(data);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  const handleAddIntern = async (values) => {
    try {
      const response = await fetch(`http://localhost:8080/students/byTitle?firstName=${encodeURIComponent(values.firstName)}&lastName=${encodeURIComponent(values.lastName)}&title=${encodeURIComponent(values.stageTitle)}&stageDescription=${encodeURIComponent(values.stageDescription)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du stagiaire');
      }

      const newIntern = await response.json();
      setInterns((prevInterns) => [...prevInterns, newIntern]);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du stagiaire:', error);
    }
  };

  const handleUpdateIntern = async (updatedIntern) => {
    try {
      const response = await fetch(`http://localhost:8080/students/update/${updatedIntern.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: updatedIntern.firstName,
          lastName: updatedIntern.lastName,
          stage: { id: updatedIntern.stage.id } // Assurez-vous que l'ID du stage est correct
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Récupérer le texte de l'erreur
        throw new Error(`Erreur ${response.status}: ${errorText}`); // Inclure le statut et le message d'erreur
      }
  
      const updatedData = await response.json();
  
      // Mettre à jour immédiatement l'état local
      setInterns((prevInterns) => 
        prevInterns.map((intern) => (intern.id === updatedData.id ? updatedData : intern))
      );
  
      setSelectedIntern(null); // Réinitialiser le stagiaire sélectionné après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stagiaire:', error.message); // Afficher le message d'erreur détaillé
    }
  };
  
  

  const handleDeleteIntern = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/students/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du stagiaire');
      }

      setInterns((prevInterns) => prevInterns.filter((intern) => intern.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du stagiaire:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Liste des Stagiaires</h1>
      <FilterableInternTable interns={interns} onUpdate={setSelectedIntern} onDelete={handleDeleteIntern} />
      
      {selectedIntern && (
        <>
          <h2 className="my-4">Modifier le Stagiaire</h2>
          <UpdateIntern intern={selectedIntern} onUpdate={handleUpdateIntern} />
        </>
      )}

      <h2 className="my-4">Ajouter un Stagiaire</h2>
      <CreateIntern onSubmit={handleAddIntern} />
    </div>
  );
}

