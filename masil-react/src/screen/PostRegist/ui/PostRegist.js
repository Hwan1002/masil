import { usePostRegist } from "../usePostRegist";
import Modal from "component/Modal";
import RentalDatePicker from "component/datepicker/DatePicker";
import LocationButton from "component/LocationButton";
import LocationPicker from "component/LocationPicker";
import InputField from "../components/InputField";
import ImageUploadSection from "../components/ImageUploadSection";
import "css/PostRegist.css";

const PostRegist = () => {
  const {
    isEdit,
    setEdit,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    selectedImages,
    commaPrice,
    startDate,
    endDate,
    registData,
    navigate,
    setStartDate,
    setEndDate,
    closeModal,
    handleSubmit,
    handleChange,
    handleFileChange,
    handleRemoveImage,
  } = usePostRegist();
  return (
    <div className="postRegist-container">
      <div className="postRegist">
        <div className="postRegist-title">
          <h2>{isEdit ? "게시글 수정" : "게시글 등록"}</h2>
          <span role="img" aria-label="memo" className="title-emoji">
            📋
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <ImageUploadSection
            selectedImages={selectedImages}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
          />
          <div className="div-grid">
            <div className="postLocation">
              <LocationButton />
              <div className="locationPicker">
                <LocationPicker />
              </div>
            </div>
            <InputField
              label="제목"
              name="postTitle"
              placeholder="게시물 제목"
              maxLength="40"
              value={registData.postTitle}
              onChange={handleChange}
            />

            <InputField
              label="가격"
              name="postPrice"
              placeholder="가격 입력"
              value={commaPrice}
              onChange={handleChange}
            />

            <div className="div-input">
              <RentalDatePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </div>

            <div className="div-input">
              <label>설명</label>
              <textarea
                className="registdescription"
                name="description"
                placeholder="등록할 물건의 설명을 작성해주세요."
                value={registData.description}
                onChange={handleChange}
              />
            </div>

            <div className="registnavigate">
              <button
                type="button"
                onClick={() => {
                  navigate("/rentalitem");
                  setEdit(false);
                }}
              >
                뒤로가기
              </button>
              <button
                type="submit"
                className={isEdit ? "modify-button" : "register-button"}
              >
                {isEdit ? "수정하기" : "등록하기"}
              </button>
            </div>
          </div>
        </form>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          content={modalMessage}
          actions={modalActions}
        />
      </div>
    </div>
  );
};

export default PostRegist;
