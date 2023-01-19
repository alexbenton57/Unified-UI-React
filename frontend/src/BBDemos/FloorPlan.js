import React from 'react';

class FloorPlan extends React.Component {


    generateSquare(id, cols, rows, xProb, yProb, length, gap) {
        let width = (length + gap) * Math.ceil(xProb + Math.random()) - gap;
        let height = (length + gap) * Math.ceil(yProb + Math.random()) -gap;
        let left = (length + gap)*Math.floor(Math.random() * cols);
        let top = (length + gap)*Math.floor(Math.random() * rows);

        let style = {position: 'absolute', height: height + 'px', width: width + 'px', left: left + 'px', top:top+'px'}
        return (
            <div className="bg-danger text-center text-middle rounded border border-dark"
                style={style} key={id}>
                    Machine
            </div >
        )
    };

    render() {
        let squareIDs = Array.apply(null, Array(10)).map(function (x, i) { return i; });
        let squares = squareIDs.map((squareID) => this.generateSquare(squareID, 10, 5 , 0.2, 0.2, 50, 10));
        return (
            <div style={{position: "absolute"}}>
                {squares}
            </div>
        )
    };
}

export {FloorPlan}