const DEMO_CONFIGS = {
  "reason-capture": {
    name: "Reason Capture",
    icon: "FileEarmarkArrowUp",
    config: {
      "8824783b-31f8-42ef-b8dd-ab3cce822ae1": {
        id: "8824783b-31f8-42ef-b8dd-ab3cce822ae1",
        gridLayout: { x: 0, y: 0, w: 6, h: 2 },
        title: "Machine Status",
        indicatorValue: { type: "http", link: "http://localhost:8000/machine/machine1/" },
        indicatorText: "Machine 1",
        bbType: "Boolean Indicator",
      },
      "d5aa6a1f-4cd9-4f98-bf4c-0b5e16c42854": {
        id: "d5aa6a1f-4cd9-4f98-bf4c-0b5e16c42854",
        gridLayout: { x: 0, y: 2, w: 12, h: 6 },
        title: "Machine 1 Log",
        logData: { type: "http", link: "http://localhost:8000/machine/machine1/" },
        bbType: "Log",
      },
      "6c6705d4-78eb-4a8e-92c1-5ccb4539ae0b": {
        id: "6c6705d4-78eb-4a8e-92c1-5ccb4539ae0b",
        gridLayout: { x: 9, y: 0, w: 3, h: 2 },
        title: "Start Machine",
        postURL: "http://localhost:8000/machine/machine1/",
        postData: '{"status": "True", "text": "Machine Started", "machine": "machine1"}',
        bbType: "POST Button",
        bbsToRefresh: [
          { bbID: "d5aa6a1f-4cd9-4f98-bf4c-0b5e16c42854" },
          { bbID: "8824783b-31f8-42ef-b8dd-ab3cce822ae1" },
        ],
      },
      "46c8d711-280f-4cb3-8629-cf8c33a707d7": {
        id: "46c8d711-280f-4cb3-8629-cf8c33a707d7",
        gridLayout: { x: 6, y: 0, w: 3, h: 2 },
        title: "Stop Machine",
        postURL: "http://localhost:8000/machine/machine1/",
        categories: [
          {
            categoryName: "Machine Fault",
            otherEnabled: true,
            categoryEntries: [
              
              { categoryEntry: "Power Off" },
              { categoryEntry: "Broken Tooling" },
              { categoryEntry: "Machine Failure" },
              { categoryEntry: "Unexpected" },
            ],
          },
          {
            categoryName: "Operator Error",
            otherEnabled: false,
            categoryEntries: [
              { categoryEntry: "Wrong Material" },
              { categoryEntry: "Wrong Machine Procedure" },
              { categoryEntry: "Wrong Tool" },
            ],
          },
        ],
        bbType: "Category Post Button",
        bbsToRefresh: [
          { bbID: "8824783b-31f8-42ef-b8dd-ab3cce822ae1" },
          { bbID: "d5aa6a1f-4cd9-4f98-bf4c-0b5e16c42854" },
        ],
      },
    },
  },

  "power-and-energy": {
    name: "Power and Energy",
    icon: "FileEarmarkBarGraph",
    config: {
      "24182562-ad65-4788-9e9a-7714bbba7976": {
        id: "24182562-ad65-4788-9e9a-7714bbba7976",
        gridLayout: { x: 3, y: 0, w: 9, h: 8 },
        title: "Power and Energy",
        useTwoAxes: true,
        xKey: "time",
        series: [
          {
            seriesName: "Power",
            seriesData: { type: "http", link: "http://localhost:8000/power/?mins=5" },
            seriesYKey: "power",
            seriesUnit: "W",
            seriesStyle: "area",
            seriesAxis: "left",
          },
          {
            seriesName: "Energy",
            seriesData: { type: "http", link: "http://localhost:8000/energy/?mins=5" },
            seriesYKey: "energy",
            seriesUnit: "Wh",
            seriesStyle: "line",
            seriesAxis: "right",
          },
        ],
        bbType: "Composed Chart",
      },
      "0dc35db3-3cc2-4e52-b8b1-55dde5dd9cc6": {
        id: "0dc35db3-3cc2-4e52-b8b1-55dde5dd9cc6",
        gridLayout: { x: 0, y: 0, w: 3, h: 4 },
        title: "Power",
        pointerValue: { type: "ws", link: "100" },
        min: 0,
        areas: [
          { color: "#5BE12C", value: "30" },
          { color: "#F5CD19", value: "60" },
          { color: "#EA4228", value: "100" },
        ],
        bbType: "Gauge",
        unit: "W",
      },
      "3cd54033-0e57-4700-b0e2-d0a1b3708fdd": {
        id: "3cd54033-0e57-4700-b0e2-d0a1b3708fdd",
        gridLayout: { x: 0, y: 4, w: 3, h: 4 },
        title: "Current",
        pointerValue: { type: "ws", link: "channel1" },
        min: "100",
        areas: [
          { color: "#FFAB68", value: "110" },
          { color: "#FFEFBF", value: "130" },
          { color: "#A5FF76", value: "170" },
          { color: "#FFEFBF", value: "190" },
          { color: "#FFAB68", value: "200" },
        ],
        bbType: "Gauge",
        unit: "mA",
      },
    },
  },

  "inventory-tracking": {
    name: "Inventory Tracking",
    icon: "FileEarmarkMedical",
    config: {
      "7957cea2-d8b1-4707-918b-7a7d367039d8": {
        id: "7957cea2-d8b1-4707-918b-7a7d367039d8",
        gridLayout: { x: 0, y: 0, w: 4, h: 1 },
        title: "Form Launcher",
        formAs: "Form Container",
        containerTarget: "4fa76a1b-1933-49eb-ab47-919092b2ce0d",
        formOptions: [
          {
            name: "location",
            verbose: "Location",
            fieldType: "choice",
            displayedAs: "pills",
            choices: ["Store 1", "Store 2"],
          },
          { name: "item", verbose: "Item", fieldType: "input" },
          { name: "qty", verbose: "quantity", fieldType: "integer" },
        ],
        bbType: "Form Button",
        buttonText: "Check Stock In/Out",
        buttonColor: "primary",
      },
      "4fa76a1b-1933-49eb-ab47-919092b2ce0d": {
        id: "4fa76a1b-1933-49eb-ab47-919092b2ce0d",
        gridLayout: { x: 0, y: 1, w: 12, h: 7 },
        title: "Form Container",
        bbType: "Form Container",
      },
      "e6db40e4-6548-4951-9bdd-f3426cc0757f": {
        id: "e6db40e4-6548-4951-9bdd-f3426cc0757f",
        gridLayout: { x: 4, y: 0, w: 4, h: 1 },
        title: "Cut Stock",
        formAs: "Form Container",
        buttonText: "Cut Stock",
        containerTarget: "4fa76a1b-1933-49eb-ab47-919092b2ce0d",
        formOptions: [
          {
            name: "location",
            verbose: "Location",
            fieldType: "choice",
            displayedAs: "pills",
            choices: ["Store 1", "Store 2"],
          },
          { name: "barcode", verbose: "Barcode", fieldType: "input" },
          { name: "qty", verbose: "Number of Cuts", fieldType: "integer" },
          { name: "length", verbose: "Cut length in m", fieldType: "integer" },
        ],
        bbType: "Form Button",
        buttonColor: "secondary",
      },
      "4fafb3be-57ca-4ae8-a3dd-c5f7a1a77edd": {
        id: "4fafb3be-57ca-4ae8-a3dd-c5f7a1a77edd",
        gridLayout: { x: 8, y: 0, w: 4, h: 1 },
        title: "Add New Stock",
        formAs: "Form Container",
        buttonText: "Add New Stock",
        buttonColor: "primary",
        containerTarget: "4fa76a1b-1933-49eb-ab47-919092b2ce0d",
        formOptions: [
          { name: "barcode", verbose: "Barcode", fieldType: "input" },
          { name: "name", verbose: "Item Name", fieldType: "input" },
          { name: "description", verbose: "Item Description", fieldType: "input" },
          { name: "qty", verbose: "Number of Cuts", fieldType: "integer" },
          {
            name: "unit",
            verbose: "Units",
            fieldType: "choice",
            defaultValue: "parts",
            diplayedAs: "pills",
            choices: ["parts", "metres", "kg"],
          },
        ],
        bbType: "Form Button",
      },
    },
  },
  "level-monitoring": {
    name: "Level Monitoring",
    icon: "FileEarmarkText",
    config: {
      "91956d6e-37e7-4188-8558-22c4d92809e6": {
        id: "91956d6e-37e7-4188-8558-22c4d92809e6",
        gridLayout: { x: 0, y: 0, w: 12, h: 8 },
        title: "Level Monitoring",
        data: { type: "ws", link: "progress_bar" },
        min: 0,
        unit: "Litres",
        thresholds: [
          { color: "success", value: "80" },
          { color: "warning", value: "90" },
          { color: "danger", value: "100" },
        ],
        bbType: "Progress Bar Array",
      },
    },
  },
};

export default DEMO_CONFIGS;
