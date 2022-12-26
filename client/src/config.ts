// Fruit: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'do0xukn0c0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-qrow3wvt3biay3d1.us.auth0.com',            // Auth0 domain
  clientId: 'FGHDIXR3ULuUwZrY7byzNXTmNTwTXEJz',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
