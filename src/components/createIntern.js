import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const InternFormSchema = Yup.object().shape({
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  stageTitle: Yup.string().required('Le titre du stage est requis'),
  stageDescription: Yup.string().required('La description du stage est requise'),
});

function CreateIntern({ onSubmit }) {
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        stageTitle: '',
        stageDescription: ''
      }}
      validationSchema={InternFormSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <Field className="form-control" type="text" name="firstName" />
            <ErrorMessage name="firstName" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <Field className="form-control" type="text" name="lastName" />
            <ErrorMessage name="lastName" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label htmlFor="stageTitle">Titre du Stage</label>
            <Field className="form-control" type="text" name="stageTitle" />
            <ErrorMessage name="stageTitle" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label htmlFor="stageDescription">Description du Stage</label>
            <Field className="form-control" type="text" name="stageDescription" />
            <ErrorMessage name="stageDescription" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Ajouter</button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateIntern;
