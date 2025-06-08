window.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (!user) {
        alert("Открой через Telegram WebApp");
        return;
    }

    const userId = String(user.id);
    const db = window.db;
    const eggImg = document.querySelector(".egg-icon");

    const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js");

    const eggRef = doc(db, "eggs", userId);
    const eggSnap = await getDoc(eggRef);

    if (eggSnap.exists()) {
        const data = eggSnap.data();
        eggImg.src = `assets/${data.type}.svg`;
    } else {
        const newEgg = getRandomEgg();
        await setDoc(eggRef, {
            type: newEgg,
            health: 100,
            progress: 0,
            createdAt: Date.now()
        });
        eggImg.src = `assets/${newEgg}.svg`;
    }
});

function getRandomEgg() {
    const eggs = ["egg1", "egg2", "egg3"];
    return eggs[Math.floor(Math.random() * eggs.length)];
}

// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBtVwpIdrC_keNIYo_r-FdXT05HvQg6YhQ",
    authDomain: "eggtest-cc6f8.firebaseapp.com",
    projectId: "eggtest-cc6f8",
    storageBucket: "eggtest-cc6f8.firebasestorage.app",
    messagingSenderId: "261666465492",
    appId: "1:261666465492:web:f65f3bad9191b2fbe57d41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;
