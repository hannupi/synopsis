const themeToggle = document.querySelector("#theme-selector")

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        apiKey: document.querySelector("#apiKey").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#apiKey").value = result.apiKey
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("apiKey");
    getting.then(setCurrentChoice, onError);
}

function toggleTheme() {
    browser.storage.sync.set({
        theme: themeToggle.checked
    })
}

function restoreTheme() {
    function setToggle(result) {
        themeToggle.checked = result.theme
    }

    function logError(error) {
        console.log(`Error: ${error}`);
    }

    let themeValue = browser.storage.sync.get("theme");
    themeValue.then(setToggle, logError);
}

themeToggle.addEventListener("click", toggleTheme);

document.querySelector("#theme-selector").addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", restoreTheme);
document.querySelector("form").addEventListener("submit", saveOptions);