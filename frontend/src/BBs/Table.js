import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import AxiosWrapper, { axiosWrapper2 } from './HTTP';

function Table(props) {

    const [data, setData] = useState(null);
    useEffect(() => {axiosWrapper2("get", props.url)
        .then((result) => {setData(result)})}, []);

    function jsonDataToColumns(data) {
        const columnHeaders = Object.keys(data[0]);
        const columns = columnHeaders.map((header) => ({ name: header.toUpperCase(), selector: row => row[header] }));
        return columns;
    };

    if (data) {
        return (
            <DataTable
                columns={jsonDataToColumns(data)}
                data={data}
            />
        )
    };
};

export default Table;