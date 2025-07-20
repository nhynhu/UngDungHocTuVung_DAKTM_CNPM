import Carousel from 'react-bootstrap/Carousel'; 
const HomeContent = () => {
  return (
    <div className="home-content-main">
      <div className="section">
        <Carousel interval={3000} controls={true} indicators={true}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="image/slide1.jpg"
          alt="First slide"
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Carousel.Caption style={{color: '#ffffffff'}}>
          <h3>Welcome to English Learning</h3>
          <p>Start your journey to master English vocabulary with our interactive app.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="image/slide3.jpg"
          alt="Second slide"
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Practice Every Day</h3>
          <p>Consistent practice is the key to improving your English vocabulary.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="image/slide4.jpg"
          alt="Third slide"
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Test Your Knowledge</h3>
          <p>Take quizzes and tests to measure your progress and improve your skills.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
      </div>
      <div className="section">
        <div className="section-title">Introduce</div>
        <div className="introduce-box">
          <div className="introduce-text" style={{ fontSize: '16px', fontFamily: "'Poppins', sans-serif",}}>
&nbsp;&nbsp;&nbsp;Ứng dụng được thiết kế nhằm giúp người dùng học và ghi nhớ từ vựng tiếng Anh một cách đơn giản, hiệu quả và dễ tiếp cận.
Từ vựng được phân loại theo các chủ đề quen thuộc như cuộc sống hàng ngày, công việc, du lịch, học tập,… giúp bạn tập trung vào nội dung phù hợp với nhu cầu.
Với hệ thống flashcard đơn giản và các bài trắc nghiệm ôn tập ngắn gọn, bạn có thể rèn luyện khả năng ghi nhớ từ vựng nhanh chóng.
Ứng dụng là người bạn đồng hành đáng tin cậy, giúp bạn học tập mọi lúc, mọi nơi. <br></br> 
&nbsp;&nbsp;&nbsp;This application is designed to help users learn and memorize English vocabulary in a simple, effective, and accessible way.
Vocabulary is organized into familiar topics such as daily life, work, travel, and education, allowing you to focus on content that suits your needs.
With a straightforward flashcard system and short review quizzes, you can quickly practice and reinforce your vocabulary memory.
The app is a reliable companion, supporting your learning anytime, anywhere.
          </div>
          <img
            src="image/introduce.png"
            alt="Mascot"
            className="mascot-img"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;