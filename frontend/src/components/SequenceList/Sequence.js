import React from 'react';
import { Card } from 'react-bootstrap';

const Sequence = (props) => {
    return ( 
        <Card style={{ width: '18rem' }} className="mx-auto mb-2">
        <Card.Body>
            <Card.Title>Sequence: {props.sequence}</Card.Title>
            <Card.Title>Classified as: {props.name}</Card.Title>
        </Card.Body>
        </Card>
     );
}
 
export default Sequence;