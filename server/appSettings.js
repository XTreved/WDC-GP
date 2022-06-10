require('dotenv').config();

var appSettings = {
    appCredentials: {
        clientId: process.env.CLIENT_ID, // Application (client) ID on Azure AD
        tenantId: process.env.TENANT_ID, // alt. "common" "organizations" "consumers"
        clientSecret: process.env.CLIENT_SECRET // alt. client certificate or key vault credential
    },
    authRoutes: {
        redirect: "/redirect", // redirect path or the full URI configured on Azure AD
        error: "/error", // errors will be redirected to this route
        unauthorized: "/unauthorized", // unauthorized access attempts will be redirected to this route
        frontChannelLogout: "/logout" // front-channel logout path or the full URI configured on Azure AD
    },
    protectedResources: {
        graph_BASE: {
            endpoint: "https://graph.microsoft.com/v1.0",
            scopes: []
        },
        profile: {
            endpoint: "https://graph.microsoft.com/v1.0/me",
            scopes: ["user.read"]
        },
        joinedTeams: {
            endpoint: "https://graph.microsoft.com/v1.0/me/joinedTeams",
            scopes: ["teamsettings.readwrite.all"]
        },
        myEvents: {
            endpoint: "https://graph.microsoft.com/v1.0/me/events",
            scopes: ["calendars.readwrite"]
        },
    }
};

module.exports = appSettings;