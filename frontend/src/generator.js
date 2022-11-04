import React from 'react'
import Table from './BBs/Table'
import * as floorPlan from './BBs/FloorPlan'
import * as userInputs from './BBs/UserInputs'
import {Card} from './App'

const allBBs = {
	"table": {"basic": Table},
	"floorPlan": {}
};



const layout = [
	{
		bbType: "table.Table",
		width: "xl",
		height: "m",
		data: [
			["Alex", 23, "Blue"],
			["Greg", 143, "Yellow"],
			["Tim", 18283, "Green"]
		],
		headers: ["Name", "Age", "Colour"]
	}, {
		bbType: "floorPlan.FloorPlan",
		width: "xxs",
		height: "m",
	}, {
		bbType: "userInputs.Basic",
		width: "xxl",
		height: "m",
	}
];

const jsonLayout = JSON.stringify(layout);

function GeneratedBB(props) {

	//const BB = import('./BBs/FloorPlan.FloorPlan')

	return (
		<Card width="m" height="m">
			{eval("<"+"table.Table"+"/>")}
		</Card>
    );
}

function GeneratedContent(props) {

	let layout = JSON.parse(jsonLayout);

	return (
		layout.map((bbSpec) => <GeneratedBB bbSpec={bbSpec} />)
	);

}

export default GeneratedContent