import React,{useState} from "react";
import '../css/PostRegist.css';
import camera from '../css/img/photo/camera.png';
import DatePicker from "../component/DatePicker";
const PostRegist = () => {


  return(
    <div className="postRegist">
      <h2>게시물 등록</h2>
        
      <form>
        <div className="formDiv formDiv1">
          <button type="button" className="registPhoto">
            <img src={camera} alt="사진 등록"/>
          </button>
          <input name="profilePhoto" type="file" accept="image/*" style={{ display: "none" }}/>
           {/* ref={inputImgRef} // onChange={ImageUpload}  */}
          <label>제목</label>
          <input name="title" type="text" placeholder="게시물 제목"/>
          <label>가격</label>
          <input name="title" type="text" placeholder="가격 입력"/>
        </div>
        <div className="formDiv formDiv2">
          <DatePicker/>
        </div>
        <div className="formDiv formDiv3">
          <label>설명</label>
          <input type="text" placeholder="등록할 물건의 설명을 작성해주세요." style={{width:"30em",height:"20em"}}/>
        </div>
      </form>
    </div>
  )
}
export default PostRegist;