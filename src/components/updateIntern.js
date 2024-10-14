import React, { useState, useEffect } from 'react';

const UpdateIntern = ({ intern, onUpdate }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    stageId: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // État pour gérer les messages d'erreur

  useEffect(() => {
    if (intern) {
      setFormValues({
        firstName: intern.firstName,
        lastName: intern.lastName,
        stageId: intern.stage ? intern.stage.id : '', // Si le stagiaire a un stage, récupère l'ID
      });
    }
  }, [intern]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, stageId } = formValues;

    try {
      const response = await fetch(`http://localhost:8080/students/update/${intern.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          stage: { id: stageId },
        }),
      });

      // Vérifie si la réponse est correcte
      if (!response.ok) {
        const errorText = await response.text(); // Obtenir le texte brut en cas d'erreur
        throw new Error(`Erreur lors de la mise à jour du stagiaire: ${errorText}`);
      }

      // Vérifie si la réponse est bien un JSON
      //await response.json(); // Vous pouvez ignorer la réponse ou l'utiliser si nécessaire

      // Recharge la page pour actualiser les données
      window.location.reload(); // Rechargement de la page
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stagiaire:', error);
      setErrorMessage(error.message); // Affiche une alerte avec le message d'erreur
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Affiche le message d'erreur si présent */}
      <div className="form-group">
        <label htmlFor="firstName">Prénom</label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Nom</label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="stageId">ID du Stage</label>
        <input
          type="text"
          className="form-control"
          id="stageId"
          name="stageId"
          value={formValues.stageId}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Mettre à jour</button>
    </form>
  );
};

export default UpdateIntern;
