module.exports = {
    /* AUTH APIs */
    '/api/v1/auth/login': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 0
            }
        }
    },
    '/api/v1/auth/logout': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 1
            }
        }
    },
    '/api/v1/auth/refresh_token': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 2
            }
        }
    },
    '/api/v1/auth/password/change': {
        "ALL": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 3
            }
        }
    },
    '/api/v1/auth/password/forgot': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 4
            }
        }
    },
    '/api/v1/auth/password/reset': {
        "ALL": {
            "POST": {
                "auth": false,
                "value": true,
                "code": 5
            }
        }
    },
    '/api/v1/application': {
        "SUPER_ADMIN": {
            "POST": {
                "auth": true,
                "value": true,
                "code": 6
            },
            "GET": {
                "auth": true,
                "value": true,
                "code": 7
            }
        }
    },
    '/api/v1/application/:id': {
        "SUPER_ADMIN": {
            "GET": {
                "auth": true,
                "value": true,
                "code": 8
            },
            "PUT": {
                "auth": true,
                "value": true,
                "code": 9
            },
            "DELETE": {
                "auth": true,
                "value": true,
                "code": 10
            },
        }
    },
}