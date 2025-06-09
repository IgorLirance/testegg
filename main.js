const db = firebase.firestore();

const eggs = [
    { id: "fire", name: "Fire", image: "assets/fire.png" },
    { id: "water", name: "Water", image: "assets/water.png" },
    { id: "grass", name: "Grass", image: "assets/grass.png" },
    { id: "air", name: "Air", image: "assets/air.png" },
    { id: "earth", name: "Earth", image: "assets/earth.png" },
    { id: "electric", name: "Electric", image: "assets/electric.png" }
];

// ❗ Замени это на свой реальный userId из Telegram
const userId = Telegram.WebApp.initDataUnsafe?.user?.id || "test_user";

async function getOrAssignEgg(userId) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists && userDoc.data().eggId) {
        const egg = eggs.find(e => e.id === userDoc.data().eggId);
        if (egg) updateEggUI(egg);
        return;
    }

    // Подсчёт количества уже выданных яиц
    const counts = {};
    for (const egg of eggs) counts[egg.id] = 0;

    const allUsers = await db.collection("users").get();
    allUsers.forEach(doc => {
        const data = doc.data();
        if (data.eggId && counts[data.eggId] !== undefined) {
            counts[data.eggId]++;
        }
    });

    // Находим яйцо с минимальным использованием
    const minCount = Math.min(...Object.values(counts));
    const leastUsedEggs = eggs.filter(e => counts[e.id] === minCount);
    const selected = leastUsedEggs[Math.floor(Math.random() * leastUsedEggs.length)];

    // Сохраняем выбор
    await userRef.set({
        eggId: selected.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    updateEggUI(selected);
}

function updateEggUI(egg) {
    document.getElementById("egg-image").src = egg.image;
    document.getElementById("egg-type").textContent = egg.name;
}

// ⚡ Стартуем
window.addEventListener("DOMContentLoaded", () => {
    getOrAssignEgg(userId);
});
