import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 왜: 학습용 프로젝트의 편의를 위해 Config를 직접 포함 (Cloudflare 환경 변수 설정 번거로움 방지)
const firebaseConfig = {
    apiKey: "AIzaSyBoF273pm9tb6DLawHuAsq7BM0EKFqfoNQ",
    authDomain: "wysh-marketing-study.firebaseapp.com",
    projectId: "wysh-marketing-study",
    storageBucket: "wysh-marketing-study.firebasestorage.app",
    messagingSenderId: "1081846422012",
    appId: "1:1081846422012:web:31e2f0ff5abfa7b1d63a79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
