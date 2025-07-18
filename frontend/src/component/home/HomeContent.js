import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './HomeContent.css';

const HomeContent = () => {
  return (
    <div className="home-content-main">
      <div className="section">
        <div className="section-title">Recent</div>
        <Card style={{ width: '18rem', borderRadius: '16px', overflow: 'hidden', marginTop: '12px' }}>
          <Card.Img variant="top" src="https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
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