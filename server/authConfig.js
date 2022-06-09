/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config();

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.CLOUD_INSTANCE + process.env.TENANT_ID, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.CLIENT_SECRET // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: "Info",
        }
    }
};

const REDIRECT_URI = process.env.REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
const GRAPH_BASE = process.env.GRAPH_API_ENDPOINT + "v1.0/";
const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";
const GRAPH_TEAMS_LIST_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me/joinedTeams";
// const GRAPH_SCHEDULE_LIST_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/";

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

module.exports = {
    msalConfig,
    appSettings,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_BASE,
    GRAPH_ME_ENDPOINT,
    GRAPH_TEAMS_LIST_ENDPOINT
};