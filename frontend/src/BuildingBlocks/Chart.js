export default function Chart({}) {




}

/*
required options
- multiaxis vs single axis
    - need to subscribe data series to an axis in multiaxis case
    - to combine into one chart
- time/number series vs categorical
    - data as {xpos: x, yVal: y}
- line vs area vs bar 
    - for each option

- for a data series
    - dataKey
    - verbose/friendly name
    - styles? - colour, line style etc
    - bar vs line vs area
    - which axis? (made available by a toggle for double axis )

modifications to form generation
- allow value of one field to trigger the appearance of another?
    - need to change initial values dynamically for this
    - give a radio field a label, then on required options give a toggleVisible:'toggle label' key
        - how to distinguish between a global toggle and a local one?
- some concept of a form group
    - non-required options in a collapsed container?
    - as an accordion? - BBs maybe represented as tabs instead? Allows for a tab for saving and loading things...
- nested multi options?
    - need recursive functions for submit and initial values etc
- eliminate datasource wrangling with useField()? - would tidy things up somewhat
- possibly refactor 'label' to 'name'

*/