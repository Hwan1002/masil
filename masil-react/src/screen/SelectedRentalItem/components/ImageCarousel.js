const ImageCarousel = ({
  images,
  currentIndex,
  onPrev,
  onNext,
  onDotClick,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="selected-image-wrapper">
      <img
        src={`http://localhost:9090${images[currentIndex]}`}
        className="selected-rental-image"
        alt="이미지"
      />
      {images.length > 1 && (
        <>
          <button
            className="carousel-arrow carousel-prev"
            onClick={onPrev}
            style={{ display: currentIndex > 0 ? "flex" : "none" }}
          >
            ❮
          </button>
          <button
            className="carousel-arrow carousel-next"
            onClick={onNext}
            style={{
              display: currentIndex < images.length - 1 ? "flex" : "none",
            }}
          >
            ❯
          </button>
        </>
      )}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => onDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
