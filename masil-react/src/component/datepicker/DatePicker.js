import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
const RentalDatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const handleStartChange = (date) => {
    setStartDate(date);
    // 종료 시간이 시작 시간보다 이전이면 초기화
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="div-datepicker">
      <div>
        <label style={{ display: "block", marginBottom: "10px" }}>
          대여 시작 시간
        </label>
        <DatePicker
          selected={startDate}
          onChange={handleStartChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="시작 시간을 선택하세요"
          minDate={new Date()}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px" }}>
          대여 종료 시간
        </label>
        <DatePicker
          selected={endDate}
          onChange={handleEndChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="종료 시간을 선택하세요"
          minDate={startDate || new Date()}
        />
      </div>
    </div>
  );
};

export default RentalDatePicker;

// import React, { useState } from "react";
// import "../css/DatePicker.css";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { TextField } from "@mui/material";
// import { ko } from "date-fns/locale";
// import "react-datepicker/dist/react-datepicker.css";
// import { DateTime } from "luxon";

// const DatePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
//       <div className="startTime">
//         a
//         <DateTimePicker
//           label="대여 시작 시간"
//           value={startDate}
//           onChange={setStartDate}
//           renderInput={(params) => <TextField {...params} />}
//           inputFormat="yyyy/MM/dd HH:mm"
//           ampm={true}
//           views={["year", "month", "day", "hours", "minutes"]}
//           openTo="Month"
//           minDate={DateTime.now().toJSDate()}
//           sx={{
//             width: "100%", //
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "10px",
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#00a32c",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               marginTop: "2px",
//             },
//             "& .MuiSvgIcon-root": {
//               color: "#007bff",
//             },
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#333",
//             },
//           }}
//         />
//       </div>
//       <div className="endTime">
//         <DateTimePicker
//           label="대여 종료 시간"
//           value={endDate}
//           onChange={setEndDate}
//           renderInput={(params) => <TextField {...params} />}
//           inputFormat="yyyy/MM/dd hh:mm a"
//           sx={{
//             width: "100%",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "10px",
//               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#00a32c",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               marginTop: "2px",
//             },
//             "& .MuiSvgIcon-root": {
//               color: "#007bff",
//             },
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#333",
//             },
//             // inputFormat 텍스트에 margin-top을 추가하려면 input 요소에 스타일을 적용
//             "& input": {
//               marginTop: "1em", // 텍스트에 margin-top 추가
//             },
//           }}
//         />
//       </div>
//     </LocalizationProvider>
//   );
// };
// export default DatePicker;
