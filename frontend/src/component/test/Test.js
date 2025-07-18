import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Topic.css';

const cards = [
  {
    title: 'Card 1',
    img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    title: 'Card 2',
    img: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    title: 'Card 3',
    img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
  {
    title: 'Card 4',
    img: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg',
    text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
  },
];

const Test = () => {
  return (
    <div className="home-content" style={{ flex: 1, padding: '32px' }}>
      <div className="row">
        {cards.map((card, idx) => (
          <div className="col-md-3 col-sm-6 mb-4" key={idx}>
            <Card className="card-equal">
              <Card.Img variant="top" src={card.img} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;