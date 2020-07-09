import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://gunreview.ml/gunreview",
  headers: {
    "Content-type": "application/json"
  }
});
