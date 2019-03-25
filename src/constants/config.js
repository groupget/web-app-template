export default {
    cognito: {
        REGION: "eu-central-1",
        USER_POOL_ID: "eu-central-1_swSI22YKe",
        APP_CLIENT_ID: "162evkj7eqs0oj80ad1ep7p9s0"
    },
    // carefully with changes - used in firebase-messaging-sw
    firebase: {
        apiKey: "AIzaSyDHHItw7x0uxC1Umiq6N49VldDubHHx-b4",
        messagingSenderId: "667329276973"
    },
    notificationServiceAddress: 'http://127.0.0.1:5000/',
    cmsGatewayAddress: 'http://localhost:8080/',
    eventAddress: 'http://localhost:8080/events/events/',
    usersAddress: 'http://localhost:8080/users/users/',
    vacationsAddress: 'http://localhost:8080/vacations/vacations/',
    workRegistersAddress: 'http://localhost:8080/workregisters/workregisters/',
};