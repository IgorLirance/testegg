window.addEventListener("DOMContentLoaded", () => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Telegram WebApp готов

    // Разворачиваем WebApp на весь экран
    tg.expand();

    // Получаем ID пользователя Telegram (и можно имя)
    const user = tg.initDataUnsafe?.user;

    if (user) {
        console.log("Пользователь:", user);
        const { id, first_name, username } = user;

        // Отобразим ID игрока в консоли (можно добавить в интерфейс)
        console.log(`ID: ${id}, Имя: ${first_name}, Username: ${username}`);
    } else {
        console.log("Информация о пользователе не получена.");
    }
});
