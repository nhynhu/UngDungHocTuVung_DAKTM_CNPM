import React from 'react';
import { Outlet } from 'react-router-dom';
import TopicCard from './TopicCard';

const cards = [
  {
    title: 'Card 1',
    img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
    text: 'Nội dung card 1',
    link: '/lessons', // Link riêng cho từng card
  },
  {
    title: 'Card 2',
    img: 'https://images.pexels.com/photos/45200/dog-puppy-on-garden-45200.jpeg',
    text: 'Nội dung card 2',
    link: '/lessons', // Link khác
  },
];

const Topic = () => {
  return (
    <div className="home-content" style={{ flex: 1, padding: '32px' }}>
      <div className="row">
        {cards.map((card, idx) => (
          <div className="col-md-3 col-sm-6 mb-4" key={idx}>
            <TopicCard {...card} />
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default Topic;