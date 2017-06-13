const slack = {
    scope: 'team:read channels:read',

    get token() {
        if (!this._token) {
            this.auth();
        }
        return this._token;
    },

    set token(token) {
        this._token = token;
    },

    req: function (url, params) {
        let body = new URLSearchParams();
        if (params) {
            for (var param in params) {
                body.append(param, params[param]);
            }
        }
        return fetch(url, params ? {method: 'POST', body: body} : {method: 'GET'})
            .then(function (response) {
                return response.json(); 
            });
    },

    test: function (params) {
        return this.req('https://slack.com/api/api.test', params);
    },

    auth: function () {
        let params = new URLSearchParams();
        params.append('client_id', this.client_id);
        params.append('scope', this.scope);
        window.open('https://slack.com/oauth/authorize?' + params.toString());
    },

    access: function (code) {
        return this.req('https://slack.com/api/oauth.access', {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code: code
        });
    },

    channels: function () {
        return this.req('https://slack.com/api/channels.list', {token: this.token});
    }
};

(function () {
    if (window.location.search) {
        let params = new URLSearchParams(window.location.search);
        let code = params.get('code');
        if (code) {
            slack.access(code).then(function (data) {
                slack.token = data.access_token;
            });
        }
    }
})();
