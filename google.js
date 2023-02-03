class Client {
    constructor() {
        this.token = null;
        this.refresh_token = null;
    }

    static setAccessToken = (token) => {
        this.token = token;
    }
}

module.exports = Client;