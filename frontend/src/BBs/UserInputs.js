import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import AxiosWrapper, { axiosWrapper2 } from './HTTP';
const axios = require('axios').default;

function Basic() {
    const SignupSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),

        last_name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),

        email: Yup.string().email('Invalid email').required('Required'),

        color: Yup.string().required("Required")

    });

    const url = 'http://127.0.0.1:8000/customusers/'

    return (

        <Formik
            initialValues={{
                first_name: '',
                last_name: '',
                email: '',
                color: '',
            }}

            onSubmit={async (values) => {
                
                axios({
                    method: "POST",
                    url: url,
                    data: values,
                    headers:   { 
                        "content-type": "application/json"
                      }
                })
                    .then(response => console.log(response))
                    .catch(error => console.log(error));

                console.log(values);
                console.log(JSON.stringify(values, null, 2));
                //axiosWrapper2("push", url, values);
                alert(JSON.stringify(values, null, 2));
                
            }}

            validationSchema={SignupSchema}
        >
            <Form>
                <div className="form-group mb-2">
                    <label htmlFor="first_name">First Name</label>
                    <Field id="first_name" name="first_name" placeholder="Jane" className="form-control" />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="last_name">Last Name</label>
                    <Field id="last_name" name="last_name" placeholder="Doe" className="form-control" />
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