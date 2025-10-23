import camera from "css/img/photo/camera.png";

// 이미지 프리뷰 컴포넌트
const ImagePreview = ({ file, onRemove, index }) => (
  <div className="preview-wrapper">
    <img
      src={URL.createObjectURL(file)}
      alt={`미리보기 ${index + 1}`}
      className="preview-image"
    />
    <button
      type="button"
      onClick={() => onRemove(index)}
      className="remove-preview"
    >
      ×
    </button>
  </div>
);

// 이미지 업로드 버튼 컴포넌트
const UploadButton = ({ onClick, imageCount }) => (
  <button type="button" onClick={onClick} className="upload-button">
    <img src={camera} alt="카메라" className="camera-icon" />
    <span>{imageCount}/4</span>
  </button>
);

// 이미지 업로드 섹션 컴포넌트
const ImageUploadSection = ({
  selectedImages,
  onFileChange,
  onRemoveImage,
}) => {
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="photoContainer">
      <input
        type="file"
        id="fileInput"
        multiple
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <div className="photoUploadBtn">
        {selectedImages.map((file, index) => (
          <ImagePreview
            key={index}
            file={file}
            index={index}
            onRemove={onRemoveImage}
          />
        ))}
        {selectedImages.length < 4 && (
          <UploadButton
            onClick={triggerFileInput}
            imageCount={selectedImages.length}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;

