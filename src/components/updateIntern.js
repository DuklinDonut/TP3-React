import React, { useEffect, useState } from 'react';

const UpdateIntern = ({ intern, onUpdate }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    stageId: '',
  });
  const [stages, setStages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (intern) {
      setFormValues({
        firstName: intern.firstName,
        lastName: intern.lastName,
        stageId: intern.stage ? intern.stage.id : '',
      });
    }
  }, [intern]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await fetch('http://localhost:8080/stages', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Unable to fetch stages');
        const data = await response.json();
        setStages(data);
      } catch (error) {
        console.error('Error fetching stages:', error);
        setErrorMessage('Unable to load stages.');
      }
    };

    fetchStages();
  }, []);

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
        credentials: 'include',
        body: JSON.stringify({
          firstName,
          lastName,
          stage: { id: stageId },
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating intern: ${errorText}`);
      }
  
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let updatedData;
  
      if (contentType && contentType.includes("application/json")) {
        updatedData = await response.json();
      } else {
        // Manually create updated data assuming stage title is available in stages list
        const stageTitle = stages.find(stage => stage.id === parseInt(stageId))?.title;
        updatedData = { ...intern, firstName, lastName, stage: { id: stageId, title: stageTitle } };
      }
  
      onUpdate(updatedData); // Call the onUpdate function passed from parent to handle the update
    } catch (error) {
      console.error('Error updating intern:', error);
      setErrorMessage(error.message);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
        <label htmlFor="stageId">Stage</label>
        <select
          className="form-control"
          id="stageId"
          name="stageId"
          value={formValues.stageId}
          onChange={handleChange}
          required
        >
          <option value="">Select a stage</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.title}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Mettre à jour</button>
    </form>
  );
};

export default UpdateIntern;
