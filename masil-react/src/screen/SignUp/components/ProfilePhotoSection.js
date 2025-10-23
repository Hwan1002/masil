const ProfilePhotoSection = ({
  imagePreview,
  onProfileClick,
  inputRef,
  onImageUpload,
}) => (
  <section className="profilePhoto">
    <div className="photoImg">
      <img src={imagePreview} alt="프로필 사진" />
    </div>
    <button type="button" onClick={onProfileClick} className="profileChangeBtn">
      프로필 사진 변경
    </button>
    <input
      type="file"
      ref={inputRef}
      onChange={onImageUpload}
      accept="image/*"
      className="hidden"
    />
  </section>
);

export default ProfilePhotoSection;

