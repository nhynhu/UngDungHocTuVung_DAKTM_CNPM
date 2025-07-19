import React from 'react';
import { Outlet } from 'react-router-dom';
import TestCard from './TestCard';

const cards = [
  {
    title: 'Test 1',
    img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
    text: 'Bài test từ vựng cơ bản',
    link: '/dotests', // Link riêng cho từng test
  },
  {
    title: 'Test 2',
    img: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    text: 'Bài test từ vựng nâng cao',
    link: '/dotests', // Link khác
  },
  {
    title: 'Test 3',
    img: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    text: 'Bài test ngữ pháp cơ bản',
    link: '/dotests',
  },
  {
    title: 'Test 4',
    img: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg',
    text: 'Bài test tổng hợp',
    link: '/dotests',
  },
];

const Test = () => {
  return (
    <div className="home-content" style={{ flex: 1, padding: '32px' }}>
      <div className="row">
        {cards.map((card, idx) => (
          <div className="col-md-3 col-sm-6 mb-4" key={idx}>
            <TestCard {...card} />
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default Test;