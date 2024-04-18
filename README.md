# React MSAL TS Demo

- [MSAL.js for React Sample - Authorization Code Flow in Single-Page Applications](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Using MSAL.js to integrate React SPA with Azure AD](https://www.youtube.com/watch?v=7oPSL5wWeS0)

## About this sample

This developer sample is used to run basic use cases for the MSAL library. You can also alter the configuration in `./src/authConfig.js` to execute other behaviors.
This sample was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notable files and what they demonstrate

1. `./src/App.tsx` - Shows implementation of `MsalProvider`, all children will have access to `@azure/msal-react` context, hooks and components.
1. `./src/index.tsx` - Shows intialization of the `PublicClientApplication` that is passed to `App.js`
1. `./src/pages/Home.tsx` - Homepage, shows how to conditionally render content using `AuthenticatedTemplate` and `UnauthenticatedTemplate` depending on whether or not a user is signed in.
1. `./src/pages/Profile.tsx` - Example of a protected route using `MsalAuthenticationTemplate`. If a user is not yet signed in, signin will be invoked automatically. If a user is signed in it will acquire an access token and make a call to MS Graph to fetch user profile data.
1. `./src/authConfig.ts` - Configuration options for `PublicClientApplication` and token requests.
1. `./src/ui-components/SignInSignOutButton.tsx` - Example of how to conditionally render a Sign In or Sign Out button using the `useIsAuthenticated` hook.
1. `./src/ui-components/SignInButton.tsx` - Example of how to get the `PublicClientApplication` instance using the `useMsal` hook and invoking a login function.
1. `./src/ui-components/SignOutButton.tsx` - Example of how to get the `PublicClientApplication` instance using the `useMsal` hook and invoking a logout function.
1. `./src/utils/MsGraphApiCall.ts` - Example of how to call the MS Graph API with an access token.
1. `./src/utils/NavigationClient.ts` - Example implementation of `INavigationClient` which can be used to override the default navigation functions MSAL.js uses

## How to run the sample

### Pre-requisites

- Ensure [all pre-requisites](../../../lib/msal-react/README.md#prerequisites) have been completed to run `@azure/msal-react`.
- Install node.js if needed (<https://nodejs.org/en/>).

### Configure the application

- Open `./src/authConfig.ts` in an editor.
- Replace client id with the Application (client) ID from the portal registration, or use the currently configured lab registration.
  - Optionally, you may replace any of the other parameters, or you can remove them and use the default values.

#### Install npm dependencies for sample

```bash
# Install dev dependencies for msal-react and msal-browser from root of repo
npm install

# Change directory to sample directory
cd react-msal-ts-demo

# Run
npm start

# Test login
# john.doe@b2cvc4u2cmsaldemodev.onmicrosoft.com
# darkword124!
```

#### Azure Entra Id Setup

```bash

# Login to zure
az login

# Set active subscription
az account set --subscription "sub-vc4u2c-demo"

# Create Resource Group
az group create --name rg-msalreactdemo-dev --location eastus

# Create Microsoft Entra Id Tenant
$env:AZURE_SUBSCRIPTION=az account show --query "id" -o tsv
$env:AZURE_RESOURCE_GROUP="rg-msalreactdemo-dev"
$env:DOMAIN="b2cvc4u2cmsaldemodev"
$env:LOCATION="eastus"

az rest --method put --url https://management.azure.com/subscriptions/$env:AZURE_SUBSCRIPTION/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.AzureActiveDirectory/b2cDirectories/$env:DOMAIN.onmicrosoft.com?api-version=2021-04-01 --body "{'location': 'United States', 'sku': {'name': 'Standard', 'tier': 'A0'}, 'properties': {'createTenantProperties': {'displayName': 'b2c-vc4u2cmsaldemo-dev', 'countryCode': 'US'}}}" --verbose

# List the tenants
az account tenant list

# Delete
az rest --method delete --url https://management.azure.com/subscriptions/$env:AZURE_SUBSCRIPTION/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.AzureActiveDirectory/b2cDirectories/$env:DOMAIN.onmicrosoft.com?api-version=2021-04-01 --verbose

# Verify if B2C tenant was removed then remove the Resource Group
az group delete --name $env:AZURE_RESOURCE_GROUP

# Login using the newly created
az login --tenant b907d549-84e1-4733-b7be-d459594670c4

# Register a client application using CLI and REST API
# https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application-cli-rest
az --version
az extension add --name account
az extension add --name healthcareapis
az provider register --namespace 'Microsoft.HealthcareApis'
az provider show --namespace Microsoft.HealthcareApis --query "resourceTypes[?resourceType=='services'].locations"

# Create the App registration
az ad app create --display-name "appreg-msalreactdemo-dev" --reply-urls "http://localhost:3000" --available-to-other-tenants false --oauth2-allow-implicit-flow true

az account show --output table

#az ad app create --display-name myappregtest1
# TODO: Without this step, we need to follow manual steps below
# https://helloitsliam.com/2023/12/12/connecting-to-azure-using-azure-cli-with-an-app-registration-and-a-certificate/

az account show

# Switch to the tenant created
# Create manually in Az Portal. Switch to the tenant created.
# Add App Registration
# Name: appreg-msalreactdemo-dev
# Accounts in this organizational directory only (b2c-vc4u2cmsaldemo-dev only - Single tenant)
# SPA, http://localhost:3000
# Click Register
# API Plate Delegate User.Read Permission from Microsoft.Graph
```

#### Running the sample development server

1. In a command prompt, run `npm start`.
1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
1. Open [http://localhost:3000/profile](http://localhost:3000/profile) to see an example of a protected route. If you are not yet signed in, signin will be invoked automatically.

The page will reload if you make edits.
You will also see any lint errors in the console.

- In the web page, click on the "Login" button and select either `Sign in using Popup` or `Sign in using Redirect` to begin the auth flow.

#### Running the sample production server

1. In a command prompt, run `npm run build`.
1. Next run `serve -s build`
1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
1. Open [http://localhost:3000/profile](http://localhost:3000/profile) to see an example of a protected route. If you are not yet signed in, signin will be invoked automatically.

#### Running the sample in IE11

`@azure/msal-react` and `@azure/msal-browser` support IE11 but the `react-scripts` package requires a few polyfills to work properly. In order to run this sample in IE11 go to `src/index.js` and uncomment the first 2 imports. We recommend using the redirect flow and setting the `storeAuthStateInCookie` config parameter to `true` in IE11 as there are known issues with popups. You can read more about the known issues with IE11 [here](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Known-issues-on-IE-and-Edge-Browser)

#### Learn more about the 3rd-party libraries used to create this sample

- [React documentation](https://reactjs.org/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Router documentation](https://reactrouter.com/web/guides/quick-start)
- [Material-UI documentation](https://material-ui.com/getting-started/installation/)

#### Running the sample development server

1. In a command prompt, run `npm start`.
1. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
1. Open [http://localhost:3000/profile](http://localhost:3000/profile) to see an example of a protected route. If you are not yet signed in, signin will be invoked automatically.

The page will reload if you make edits.
You will also see any lint errors in the console.

- In the web page, click on the "Login" button and select either `Sign in using Popup` or `Sign in using Redirect` to begin the auth flow.

#### Running the sample production server

1. In a command prompt, run `npm run build`.
1. Next run `serve -s build`
1. Open [http://localhost:5000](http://localhost:3000) to view it in the browser.
1. Open [http://localhost:5000/profile](http://localhost:3000/profile) to see an example of a protected route. If you are not yet signed in, signin will be invoked automatically.

#### Learn more about the 3rd-party libraries used to create this sample

- [React documentation](https://reactjs.org/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Router documentation](https://reactrouter.com/web/guides/quick-start)
- [Material-UI documentation](https://material-ui.com/getting-started/installation/)
