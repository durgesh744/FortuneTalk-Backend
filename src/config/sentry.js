const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const SentrySetup = (app) => {
    // use sentry only in production
    if (process.env.NODE_ENV !== "production") {
        console.log(`sentry.io not initialized in ${process.env.NODE_ENV} mode`);
    } else {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Tracing.Integrations.Express({ app }),
            ],
            tracesSampleRate: 1.0,
        });

        app.use(
            Sentry.Handlers.requestHandler({
                user: ["user_id", "email", "name"],
            })
        );
        app.use(Sentry.Handlers.tracingHandler());
    }
}

const SentryErrorHandler = (app) => {
    if (process.env.NODE_ENV === "production") {
        console.log(`sentry.io initialized in ${process.env.NODE_ENV} mode`);
        app.use(Sentry.Handlers.errorHandler());
    }
}


module.exports = {
    SentrySetup,
    SentryErrorHandler
}