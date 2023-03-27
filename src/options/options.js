const themeToggle = document.querySelector("#theme-selector")

function saveOptions(e) {
    e.preventDefault();
    const key = document.querySelector("#apiKey").value.trim()
    browser.storage.sync.set({
        apiKey: key
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        console.log(result.apiKey)
        const asd = result.apiKey.split("")
        console.log("asd", asd);
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