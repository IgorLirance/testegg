document.addEventListener("DOMContentLoaded", async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe) {
        alert("Открой игру через Telegram!");
        return;
    }

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe.user;
    const userId = String(user.id);
    console.log("Telegram ID:", userId);

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

async function getOrAssignEgg(userId) {
    const db = window.db;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().eggId) {
        updateEggUI(userSnap.data().eggId);
        return;
    }

    const counts = {};
    eggs.forEach(e => counts[e.id] = 0);

    const allUsers = await getDocs(collection(db, "users"));
    allUsers.forEach(doc => {
        const eggId = doc.data().eggId;
        if (eggId && counts.hasOwnProperty(eggId)) {
            counts[eggId]++;
        }
    });

    const minCount = Math.min(...Object.values(counts));
    const leastUsed = eggs.filter(e => counts[e.id] === minCount);
    const selected = leastUsed[Math.floor(Math.random() * leastUsed.length)];

    await setDoc(userRef, {
        eggId: selected.id,
        createdAt: Date.now()
    });

    updateEggUI(selected.id);
}

function updateEggUI(eggId) {
    const egg = eggs.find(e => e.id === eggId);
    if (!egg) return;
    const img = document.getElementById("egg-image");
    const label = document.getElementById("egg-type");
    if (img) img.src = egg.image;
    if (label) label.textContent = egg.name;
}
