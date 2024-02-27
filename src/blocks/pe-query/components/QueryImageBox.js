import {useState, useEffect} from '@wordpress/element'

export const QueryImageBox = ({ imageUrls,postUrl }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [url] = useState(postUrl);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const dotElements = imageUrls.map((_, index) => (
      <button 
        key={index} 
        className={`bi ${currentImageIndex === index ? 'bi-circle-fill' : 'bi-circle'}`}
        onClick = {() => setCurrentImageIndex(index) }
      ></button>
    ));
    setDots(dotElements);
  }, [currentImageIndex, imageUrls]);


  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageUrls.length - 1));
  };



  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  return (
    <>
      {currentImageIndex > 0 && (
        <button onClick={handlePrevClick} className="arrow left-arrow">
          <i className="bi bi-arrow-left"></i>
        </button>
      )} 
      <a href = {url}>
        <img src={imageUrls[currentImageIndex]} alt="" />
      </a>
      {currentImageIndex < imageUrls.length - 1 && (
        <button onClick={handleNextClick} className="arrow right-arrow">
          <i className="bi bi-arrow-right"></i>
        </button>
      )}
      {imageUrls.length > 1 && <div className = "image-dots">
        {dots}
      </div>}
    </>
  );
}