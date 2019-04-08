export default function getTokenFromLocalStorage(tokenPostfix) {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('CognitoIdentityServiceProvider') && key.endsWith(tokenPostfix)) {
            return localStorage.getItem(key);
        }
    }
}