import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
const GridLayoutFullWidth = WidthProvider(GridLayout);

const layouts = {
  lg: [
    { i: "a", x: 0, y: 0, w: 2, h: 2, static: true },
    { i: "b", x: 2, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 5, y: 0, w: 1, h: 2 },
  ],
  md: [
    { i: "a", x: 0, y: 0, w: 2, h: 2, static: true },
    { i: "b", x: 2, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 5, y: 0, w: 1, h: 2 },
  ],
};

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ReactGridLayoutDemo() {
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "a", x: 0, y: 0, w: 2, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={layout => console.log(layout)}
    >
      {layout.map((obj) => (
        <div key={obj.i} style={{ overflow: "hidden" }}>
          <GridCard />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}

function GridCard({}) {
  return (
    <div className="card h-100">
      <div className="card-header">Card Header</div>
      <div className="card-body">Card Body</div>
    </div>
  );
}
