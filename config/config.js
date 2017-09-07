
/**
 * Config
 * Contains the app configuration
 */

module.exports = {
    app: {
        name: 'Questnr',
        port: 3006,
        env: 'dev',
        version: '0.9.1'
    },

    db: {
        host: 'localhost',
        port: '5984'
    },

    redis: {
        db: 1,
        host: 'localhost',
        port: '6379'
    },

    session: {
        secret: 'sfsojafoaij239323jkdslasfs'
    },

    cookie: {
        maxAge: 180 * 60 * 1000
    },

    captcha: {
        url: 'https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={response}&remoteip={address}',
        key: '6LcEzSsUAAAAAM_18MKGDB-UTlKcch9WlWagugTD',
        secret: '6LcEzSsUAAAAAKdMb-thgai_SZLjJldyhLxYfu8V'
    },

    encryption: {
        key: 'sdfjsfdljljdsfjlhdgfhjl',
        iv: 'ACS9CkIvUJDS9043K'
    },

    idleTimeout: 15,

    email: {
        sender: {
            service: "gmail",
            auth: {
                user: "neven.dyulgerov@gmail.com",
                pass: "j5RyuARn7974ZzxZiykZ2Q=="
            }
        },
        from: {
            noreply: "noreply@questnr.com",
            support: "support@questnr.com",
            general: "support@questnr.com"
        },
        alertRecipients: [
            "neven.dyulgerov@gmail.com"
        ]
    },

    questionnaires: {
        statuses: {
            assigned: 'assigned',
            completed: 'completed',
            closed: 'closed'
        },
        format: {
            minLenShort: 20,
            maxLenShort: 100,
            minLenLong: 100,
            maxLenLong: 500
        }
    },

    statuses: {
        questionnaires: {
            assigned: 'assigned',
            completed: 'completed',
            closed: 'closed'
        }
    },

    address: {
        city: 'Sofia',
        country: 'Bulgaria',
        address: 'Simeonovsko shose 173 fl.2, ap.6',
        postCode: '1434'
    }
};