import React from 'react';
import { Card } from 'react-bootstrap';

const Sequence = (props) => {
    return ( 
        <Card style={{ width: '50rem' }} className="mx-auto mb-2">
        <Card.Body>
            <Card.Title>Sequence: {props.sequence}</Card.Title>
            <Card.Title>gamma: {props.gamma}</Card.Title>
            <Card.Title>Classified as: {props.name}</Card.Title>
            <Card.Title>Rank5 labels: {props.rank5_name.join(", ")}</Card.Title>
            <Card.Title>Rank5 probability: {props.rank5_prob.join("%, ")+'%'}</Card.Title>
        </Card.Body>
        </Card>
     );
}
 
export default Sequence;