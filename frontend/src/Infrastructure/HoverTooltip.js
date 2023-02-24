import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip" ;

function TriggerExample() {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Simple tooltip
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
      <Button variant="success">Hover me to see</Button>
    </OverlayTrigger>
  );
}

/*
placement:
 	
'auto-start' | 'auto' | 'auto-end' | 'top-start' | 'top' |
 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-end' |
  'bottom' | 'bottom-start' | 'left-end' | 'left' | 'left-start'
*/

export default function HoverTooltip({ children, toShow, placement }) {
  const renderTooltip = (props) => (

    <div className="bg-light text-dark fs-6 p-3 text-start border rounded" id="button-tooltip" {...props}>
      {toShow}
    </ div>
  );

  return (
    <OverlayTrigger placement={placement || "auto"} delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
}
