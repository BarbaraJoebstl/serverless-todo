const apiId = 'yjlm6crwa8'
const stage = 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/${stage}`

export const authConfig = {
  domain: 'dev-l8u10djm.eu.auth0.com', // Auth0 domain
  clientId: 'ItoeKWlNgq3h4O4f0HVaPL569B7u0Qoh', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
