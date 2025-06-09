window.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (!user) {
        console.log("Открой через Telegram WebApp");
        return;
    }

    const userId = String(user.id);
    console.log("Telegram User ID:", userId);
    await getOrAssignEgg(userId);
});

const eggs = [
    { id: "fire", name: "Fire", image: "assets/fire.png" },
    { id: "water", name: "Water", image: "assets/water.png" },
    { id: "grass", name: "Grass", image: "assets/grass.png" },
    { id: "air", name: "Air", image: "assets/air.png" },
    { id: "earth", name: "Earth", image: "assets/earth.png" },
    { id: "electric", name: "Electric", image: "assets/electric.png" }
];

const db = firebase.firestore();

async function getOrAssignEgg(userId) {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists && userDoc.data().eggId) {
        const egg = eggs.find(e => e.id === userDoc.data().eggId);
        if (egg) updateEggUI(egg);
        return;
    }

    const counts = {};
    eggs.forEach(e => counts[e.id] = 0);

    const allUsers = await db.collection("users").get();
    allUsers.forEach(doc => {
        const data = doc.data();
        if (data.eggId && counts[data.eggId] !== undefined) {
            counts[data.eggId]++;
        }
    });

    const minCount = Math.min(...Object.values(counts));
    const leastUsed = eggs.filter(e => counts[e.id] === minCount);
    const selected = leastUsed[Math.floor(Math.random() * leastUsed.length)];

    await userRef.set({
        eggId: selected.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    updateEggUI(selected);
}

function updateEggUI(egg) {
    const img = document.getElementById("egg-image");
    const label = document.getElementById("egg-type");
    if (img) img.src = egg.image;
    if (label) label.textContent = egg.name;
}
