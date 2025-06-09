window.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
        alert("Открой через Telegram");
        return;
    }

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (user) {
        console.log("Telegram user ID:", user.id);
        document.getElementById("egg-type").textContent = `Привет, ${user.first_name}`;
    } else {
        console.log("Данных Telegram нет.");
    }
});
