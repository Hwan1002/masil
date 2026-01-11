const PostInfo = ({ item, formatDate, formatCurrency }) => (
  <div className="selected-post-info">
    <div className="selected-info">
      <div className="div-flex">
        <label>등록일 : </label>
        <p className="mb-0">{formatDate(item.updateDate)}</p>
      </div>
      <div className="div-flex">
        <label>대여일 : </label>
        <p className="mb-0">{formatDate(item.postStartDate)}</p>
      </div>
      <div className="div-flex">
        <label>가격 : </label>
        <p className="mb-0">{formatCurrency(item.postPrice)}원</p>
      </div>
      <div className="div-flex">
        <label>거래희망장소 : </label>
        {item.address}
      </div>
    </div>
    <div className="selected-description">
      <label>설명 : </label>
      <p>{item.description}</p>
    </div>
  </div>
);

export default PostInfo;

