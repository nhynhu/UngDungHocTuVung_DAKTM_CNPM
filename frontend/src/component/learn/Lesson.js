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
    <div style={{ textAlign: 'center', marginTop: 32,}}>
      <h1>Chủ đề</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
        <Flashcard front={flashcards[index].front} back={flashcards[index].back} />
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
        <button onClick={prevCard}>&#8592;</button>
        <button onClick={nextCard}>&#8594;</button>
      </div>
    </div>
  );
};

export default Lesson;
// filepath: d:\DoAn\frontend\src\component\learn\Lesson.js