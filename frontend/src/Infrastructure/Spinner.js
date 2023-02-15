import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner() {
    return (
        <div style={{position:"absolute", top:"50%", left:"50%"}}>
            <Spinner animation="border" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>

        </div>

    );
}

