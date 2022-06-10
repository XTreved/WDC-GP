require('dotenv').config();

const appSettings = {
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
        graphAPI: {
            endpoint: "https://graph.microsoft.com/v1.0/", // Microsoft Graph API
            scopes: ["User.Read","TeamSettings.ReadWrite.All","Schedule.ReadWrite.All"]
        }
    }
};

module.exports = appSettings;