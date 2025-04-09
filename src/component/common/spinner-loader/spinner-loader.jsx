import React from "react";
import { Spinner } from "reactstrap";

function SpinnerLoader() {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            margin: '-25px 0 0 -80px'
        }}>
            <Spinner
                animation="grow"
                variant="secondary"
                role="status"
                style={{
                    height: "100px",
                    width: "100px",
                    display: "block",
                    color: "#125875",
                }}
            />
        </div>
    );
}

export default SpinnerLoader;
