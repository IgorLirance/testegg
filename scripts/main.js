window.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
        alert("Открой игру через Telegram!");
        return;
    }

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;

    if (!user) {
        alert("Не удалось получить данные Telegram.");
        return;
    }

    const userId = user.id.toString();
    const db = window.db;

    const { doc, getDoc, setDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js");

    const userRef = doc(collection(db, "users"), userId);
    const snapshot = await getDoc(userRef);

    let eggType = "";
    const eggTypes = ["fire", "water", "grass", "air", "earth", "electric"];

    if (snapshot.exists()) {
        // У пользователя уже есть яйцо
        eggType = snapshot.data().eggType;
        console.log("Яйцо уже выдано:", eggType);
    } else {
        // Выдаём новое яйцо
        const randomIndex = Math.floor(Math.random() * eggTypes.length);
        eggType = eggTypes[randomIndex];

        await setDoc(userRef, {
            eggType: eggType,
            createdAt: Date.now()
        });

        console.log("Новое яйцо выдано:", eggType);
    }

    const eggImage = document.getElementById("egg-image");
    const eggText = document.getElementById("egg-type");

    eggImage.src = `assets/${eggType}.png`;
    eggText.textContent = `Ваше яйцо: ${eggType}`;
});
