import React, { useState } from 'react';
import Flashcard from './Flashcard';

const flashcards = [
  { front: 'Apple', back: 'Quả táo' },
  { front: 'Banana', back: 'Quả chuối' },
  { front: 'Cat', back: 'Con mèo' },
  // Thêm flashcard khác tại đây
];

const Lesson = () => {
  const [index, setIndex] = useState(0);

  const prevCard = () => setIndex(index > 0 ? index - 1 : flashcards.length - 1);
  const nextCard = () => setIndex(index < flashcards.length - 1 ? index + 1 : 0);

  return (
    <div style={{ textAlign: 'center', marginTop: '60px', position: 'relative'}}>
      {/* Ảnh góc trái trên */}
    <img
      src="image/flashcard2.png"
      alt="ảnh góc trái trên"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120px',
        opacity: 0.9,
        zIndex: 1,
      }}
    />
      <h1 style={{color:'#E7487D'}}>Chủ đề</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220}}>
        <Flashcard front={flashcards[index].front} back={flashcards[index].back} />
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <button onClick={prevCard} style={{color: '#E7487D'}}>&#8592;</button>
        <button onClick={nextCard} style={{color: '#E7487D'}} >&#8594;</button>
      </div>
     
      {/* Ảnh góc phải dưới */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: 0,
          zIndex: -1,
          width: '120px',

        }}
      >
        <img
          src="/image/flashcard1.jpg"
          alt="Trang trí góc phải"
          style={{
            width: '100%',
            opacity: 0.8,
            height: 'auto',
          }}
        />
      </div>
          </div>
        );
};

export default Lesson;
// filepath: d:\DoAn\frontend\src\component\learn\Lesson.js