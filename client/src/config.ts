const apiId = '...'
const stage = '...'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/${stage}`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: '...', // Auth0 domain
  clientId: '...', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
