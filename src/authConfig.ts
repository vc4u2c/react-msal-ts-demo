import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "8af5eedf-4418-4e95-a200-aec4546dbe9f",
        authority: "https://login.microsoftonline.com/73521cbe-9858-4230-996d-319b8074e103",
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        clientCapabilities: ['CP1']
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"],
};

export const claimsRequest = {
    claims: '{"id_token": {"test1": {"essential": true}, "email": {"essential": true}, "auth_time": {"essential": true}}, "userinfo": {"groups": null, "email": {"essential": true}, "auth_time": {"essential": true}}}'
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
