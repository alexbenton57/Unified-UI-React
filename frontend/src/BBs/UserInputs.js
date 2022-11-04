import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';


function Basic() {
    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),

        lastName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),

        email: Yup.string().email('Invalid email').required('Required'),

        color: Yup.string().required("Required")

    });

    return (

        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                color: '',
            }}
            onSubmit={async (values) => {
                console.log(JSON.stringify(values, null, 2));
                alert(JSON.stringify(values, null, 2));
                await new Promise((r) => setTimeout(r, 500));
            }}
            validationSchema={SignupSchema}
        >
            <Form>
                <div className="form-group mb-2">
                    <label htmlFor="firstName">First Name</label>
                    <Field id="firstName" name="firstName" placeholder="Jane" className="form-control" />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="lastName">Last Name</label>
                    <Field id="lastName" name="lastName" placeholder="Doe" className="form-control" />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="email">Email</label>
                    <Field
                        id="email"
                        name="email"
                        placeholder="jane@acme.com"
                        type="email"
                        className="form-control"
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="color">Color</label>
                    <Field id="color" name="color" as="select" className="form-select">
                        <option value={null}> -- select an option -- </option>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="orange">Orange</option>
                    </Field>
                </div>
                <button type="submit" className="btn btn-primary my-3">Submit</button>
            </Form>
        </Formik>

    );
}

function MyForm() {
    return (
        <div>Form</div>
    );
}

export { MyForm, Basic }