const UserInfo = ({ profilePhoto, nickname, address }) => (
  <div className="user-info">
    <div className="userInfo-img">
      <img
        src={`http://localhost:9090${profilePhoto}`}
        alt="프로필"
        className="selected-rental-profile-image"
      />
    </div>
    <div className="userInfo-text">
      <div>{nickname}</div>
      <div>{address}</div>
    </div>
  </div>
);

export default UserInfo;

