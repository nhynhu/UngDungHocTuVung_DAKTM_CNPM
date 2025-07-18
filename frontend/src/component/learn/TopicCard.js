import React from 'react';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';

const TopicCard = ({ title, img, text, link }) => (
  <Card className="card-equal">
    <Card.Img variant="top" src={img} />
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
      <NavLink
        to={link}
        className="btn btn-primary"
        style={{ display: 'inline-block' }}
      >
        Học ngay
      </NavLink>
    </Card.Body>
  </Card>
);

export default TopicCard;