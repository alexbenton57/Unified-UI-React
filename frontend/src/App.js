import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
	RecoilRoot,
	atom,
	selector,
	useRecoilState,
	useRecoilValue,
} from 'recoil';

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Table, { TestTable } from './BBs/Table.js';
import { FloorPlan } from './BBs/FloorPlan';
import { LargeNumber } from './BBs/indicators.js';
import { NavBar, SideBar } from './BBs/navigation.js';
import { ConnectionSymbol } from './BBs/WebSocket.js';
import { Basic } from './BBs/UserInputs.js';


import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Shoestring.css';

function App() {
	return (<AppContent />);
	//return (<AppWithReactContext />);
}

 function AppWs() {
    const [isPaused, setPause] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("wss://ws.kraken.com/");
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = e => {
            if (isPaused) return;
            const message = JSON.parse(e.data);
            console.log("e", message);
        };
    }, [isPaused]);

    return (
        <div>
            <button onClick={() => setPause(!isPaused)}>
                {isPaused ? "Resume" : "Pause"}
            </button>
        </div>
    );
}


function AppWithReactContext() {

	const webSocketRef = useRef(null);
	const [socketData, setSocketData] = React.useState({})
	const WSContext = React.createContext({});

	useEffect(() => {
		webSocketRef.current = new W3CWebSocket('ws://127.0.0.1:8000/ws/indicator');
		webSocketRef.current.onopen = () => console.log("WebSocket Connection Opened");
		webSocketRef.current.onclose = () => console.log("Websocket Connect Closed");

		return () => webSocketRef.current.close();

	}, []);

	useEffect(() => {
		webSocketRef.current.onmessage = (message) => {
			console.log("Websocket Received", message.data);
			const data = JSON.parse(message.data);
			var socketDataCopy = { ...socketData };
			socketDataCopy[data.tag] = data.value;
			// Line below rerenders entire app every time - no bueno
			// Which I think means redux is the answer
			setSocketData(socketDataCopy);
			console.log("Socket Data: ", socketData);
		};
	}, [])

	return (
		<WSContext.Provider value={1}>
			<AppContent />
		</WSContext.Provider>

	);
}

function AppWithRecoil() {

	const [val, setVal] = useState(null);
	const [allRecoilConsumers, setAllRecoilConsumers] = useRecoilState(allRecoilConsumersAtom);
	const webSocketRef = useRef(null);

	const allRecoilConsumersAtom = atom({
		key: "allRecoilConsumers",
		default: []
	})

	const recoilConsumerAtom = (tag) => atom({
		key: `${tag}`,
		default: 0
	})

	//https://alexduterte.medium.com/recoil-js-and-its-dynamic-state-2431ac8406aa

	useEffect(() => {

		const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/indicator');

		client.onopen = () => {
			console.log("WebSocket Connection Opened");;
		};

		client.onclose = () => {
			console.log("Websocket Connect Closed");
		};

		client.onmessage = (message) => {
			console.log("Websocket Received", message.data);
			const data = JSON.parse(message.data);
			if (allRecoilConsumers.includes(data.tag)) {
				//Update apropriate recoil consumer
			} else {
				// create hook for managing recoil consumer - doesn't seem possible
				// Would need to dynamically create eg [consumer{tag}, setConsumer{tag}] as dynamic var names
			}
		};

		webSocketRef.current = client;

		return () => {
			client.close();
		};
	}, []);

	return (
		<RecoilRoot>
			<AppContent />
		</RecoilRoot>

	);
}

function AppWithRedux() {
	//https://javascript.plainenglish.io/the-only-introduction-to-redux-and-react-redux-youll-ever-need-8ce5da9e53c6
	//https://react-redux.js.org/tutorials/quick-start 

	return (
		<div>Empty Div</div>
	)
}

function Cards() {
	return (
		<Fragment>
			<Card width="s" height="l" ><FloorPlan /></Card>
			<Card width="xxs" height="l" > <TestTable />  </Card>
			<Card width="xxs" height="l" > <ConnectionSymbol />  </Card>
			<Card width="xxs" height="l"> Next - create component which can choose data source</Card>
			<Card width="xxl" height="m"> <Table url='http://127.0.0.1:8000/customusers/' /> </Card>
			<Card width="xxl" height="s"> Next Step is get form to submit with axios, use Django rest framework to do CRUD operations then display data in a table. Need to get the datatable component working properly. Not far off I don't think <p>https://react-data-table-component.netlify.app/?path=/docs/getting-started-examples--page</p></Card>
			<Card width="xxl" height="xl"> <Basic /> </Card>
		</Fragment>
	);
}


function Card(props) {

	let widthDict = {
		"xss": "col-2",
		"xs": "col-3",
		"s": "col-4",
		"m": "col-6",
		"l": "col-8",
		"xl": "col-9",
		"xxl": "col-12",
	};

	let heightDict = {
		"xxs": "card-sixth",
		"xs": "card-quarter",
		"s": "card-third",
		"m": "card-half",
		"l": "card-two-third",
		"xl": "card-full",
	};

	return (
		<div className={"col " + widthDict[props.width]}>
			<div className={"card " + heightDict[props.height]}>
				<div className="card-header">A Building Block</div>
				<div className="card-body">
					{props.directContent && props.directContent}
					{props.children}
				</div>
				<div className="card-footer">A Card Footer</div>
			</div>
		</div>
	);
}


function AppContent() {
	return (
		<div className="container-fluid fixed-top">
			<NavBar />
			<div className="row">
				<div className="col col-3 col-xl-2 px-0">
					<SideBar />
				</div>
				<div className="col p-0" id="MainContentWindow">
					<div className="stfixed px-0 py-4">
						<div className="row g-3 m-3">
							<Cards />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App;
export { Card }
