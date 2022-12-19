import React, { Fragment, useEffect, useState, useRef } from 'react'
import * as Icon from 'react-bootstrap-icons';
import ReactModal from 'react-modal';

import Table, { TestTable } from './BBs/Table.js';
import { FloorPlan } from './BBs/FloorPlan';
import { NavBar, SideBar } from './BBs/navigation.js';
import { Basic } from './BBs/UserInputs.js';
import { SocketHandler, SocketLogger } from './websocket.js';
import { SocketEnabledIndicator, ConfigurableIndicator } from './BBs/indicators.js';
import { ConfigurableComponent } from './BBs/ConfigurableComponent.js';
import { ConfigurableCard } from './ConfigurableCard.js';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle"
import './Shoestring.css';

ReactModal.setAppElement(document.getElementById('root'))

function App() {
	//return (<AppContent />);
	return (
		<SocketHandler>
			<AppContent />
		</SocketHandler>
	);
}
function AppContent() {

	return (
		<div style={{ scrollX: "hidden" }}>
			<div id="navBarContainer">
				<NavBar />
			</div>
			<div id="sideBarContainer">
				<SideBar />
			</div>
			<div id="modalWindow">


				<div className="container-fluid p-0" id="mainWindowContainer">
					<div className="row g-3 py-3 mx-3">
						<Cards />
					</div>
				</div>
			</div>
		</div>

		/*
		<div className="container-fluid">
			<NavBar />
			<div className="row">
				<div className="col col-3 col-xl-2 px-0">
					<SideBar />
				</div>
				<div className="col p-0" id="MainContentWindow">
					<div className="px-0 py-4" style={mainWindowStyle}>
						<div className="row g-3 m-3" id="ModalWindow">
							<Cards />
						</div>
					</div>
				</div>
			</div>
		</div>
		*/
	)
}

function Cards() {

	const [indicatorSettings, setIndicatorSettings] = useState(JSON.parse('{"redEnd":20,"yellowEnd":60,"greenColor":"danger"}'));

	return (
		<Fragment>
			<Card width="xxl" height="xs" title="JSON Input for Configurable Indicator">
				<div className="row px-3">
					<input className="col-12" type="text" value={JSON.stringify(indicatorSettings)} onChange={(e) => setIndicatorSettings(JSON.parse(e.target.value))} />
				</div>
				<p>Next is correct websocket issues by making custom event emitter. Want to be able to reconnect to websocket if it goes down. Also make connection symbol display reconnecting etc. </p>
				<a href="https://betterprogramming.pub/how-to-create-your-own-event-emitter-in-javascript-fbd5db2447c4">Medium Article</a>
			</Card>
			<Card width="s" height="m" title="Configurable Indicator">
				<p>This component receives appearance parameters from the JSON input above. </p>
				{React.cloneElement(<ConfigurableComponent />, { redEnd: indicatorSettings.redEnd, yellowEnd: indicatorSettings.yellowEnd, greenColor: indicatorSettings.greenColor })}
				<p>Lots of error checking needs to be addd to this! Invalid JSON will break the component.</p>
				<p>The template json from the above should be able to be extracted from the code of thecomponent itself to keep things DRY. The ability to auto generate a form would be useful too (this will have to be done anyway to create a proper user input building block.)</p>
				<p>Want to be able to extract a menu of options for a configuration tool. We want this menu to be defined in a single place - in the component itself makes sense (or maybe as a seperate const in the component's file) </p>
			</Card>
			<ConfigurableCard width="s" height="m" title="Configurable Card" content={ConfigurableComponent}></ConfigurableCard>
			<Card width="s" height="m" title="Websocket Logger" > <SocketLogger /> </Card>
			<Card width="s" height="m" title="Subscribing to a WebSocket Message Tag"> <SocketEnabledIndicator /> <p className='text-sm'>Note - The websocket system definitely needs checking - there are are a lot of subtleties I'm sure I'm missing</p></Card>
			<Card width="s" height="s" title="Note"> Next I want to reconfigure Component to have a settings icon which can pull out a list of parameters from a building block and feed them into an autoformatted form. <hr /> Also check out KendoReact for UI components.</Card>
			<Card width="s" height="s" title="Indicator configurable through a form"> <ConfigurableIndicator /> <p></p></Card>
			<Card width="s" height="s" title="Pulling options object from a component">
				<p>Configurable Indicator Options:</p>
				<p>{JSON.stringify(ConfigurableComponent.options)}</p>
				<p>Next step is to dynamically create a form from these, possibly using a helper function on the options object, eg orientation: addChoice(...), redEnd: addFloat(). Form input verification and formatting can go off that.</p>
			</Card>

			<Card width="xxl" height="m" title="Users table"> <Table url='http://127.0.0.1:8000/customusers/' /> </Card>
			<Card width="xxl" height="m" title="Form to create new users"> <Basic /> </Card>
			<Card width="xxl" height="l" title="Randomised Factory Floor" ><FloorPlan /></Card>
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
			<div className={"card " + heightDict[props.height]} style={{ boxShadow: "-3px 3px 4px #EEE" }}>
				<div className="card-header">
					{props.title ? props.title : "A Building Block"}
				</div>
				<div className="card-body">
					{props.directContent && props.directContent}
					{props.children}
				</div>
				{props.footer && <div className="card-footer">A Card Footer</div>}
			</div>
		</div>
	);
}




export default App;
export { Card }


