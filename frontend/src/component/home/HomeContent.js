import Carousel from 'react-bootstrap/Carousel'; 
const HomeContent = () => {
  return (
    <div className="home-content-main">
      <div className="section">
        <Carousel interval={3000} controls={true} indicators={true}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/800x400/007bff/ffffff?text=Learn+English+Vocabulary"
          alt="First slide"
          style={{ height: '300px', objectFit: 'cover' }}
        />
        <Carousel.Caption>
          <h3>Welcome to English Learning</h3>
          <p>Start your journey to master English vocabulary with our interactive app.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/800x400/28a745/ffffff?text=Practice+Daily"
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
          src="https://via.placeholder.com/800x400/dc3545/ffffff?text=Test+Your+Skills"
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
          <div className="introduce-text">
            Giới thiệu về ứng dụng học từ vựng Tiếng Anh – Introduction to English vocabulary learning application
          </div>
          <img
            src="https://pngimg.com/uploads/pink_panther/pink_panther_PNG71.png"
            alt="Mascot"
            className="mascot-img"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;