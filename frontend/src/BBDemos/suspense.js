import React, { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";
import { RechartDemoSuspense } from "./Recharts";
import LoadingSpinner from "./Spinner";
// import CatsUsingSuspense from "./components/CatsUsingSuspense";



export default function SuspenseFetch() {
    const url = "http://localhost:8000/datums/?name=datum1&history=7"

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ComponentWrapper fetchedResource={makePromise(url)} />
        </Suspense>
    );
};

export function ComponentWrapper(props) {

    const data = props.fetchedResource.read()
    
    return (
        <RechartDemoSuspense data={data} />
    )

}

export function makePromise(url) {

    const promise = () => axios.get(url)
        .then((res) => res.data.results)
        .catch((err) => console.log(err));


    let status = "pending";
    let result;
    let suspend = promise().then(
        (res) => {
            status = "success";
            result = res;
        },
        (err) => {
            status = "error";
            result = err;
        }
    );
    return {
        read() {
            if (status === "pending") {
                throw suspend;
            } else if (status === "error") {
                throw result;
            } else if (status === "success") {
                return result;
            }
        }
    };
}


