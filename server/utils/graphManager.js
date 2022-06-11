const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

/**
 * Creating a Graph client instance via options method.
 */
const getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
};

module.exports = {
    getAuthenticatedClient
};

// module.exports = {
//     getUserDetails: async function(msalClient, userId) {
//         const client = getAuthenticatedClient(msalClient, userId);
    
//         const user = await client
//           .api('/me')
//           .select('displayName,mail,mailboxSettings,userPrincipalName')
//           .get();
//         return user;
//       },
    
//       // <GetCalendarViewSnippet>
//       getCalendarView: async function(msalClient, userId, start, end, timeZone) {
//         const client = getAuthenticatedClient(msalClient, userId);
    
//         return client
//           .api('/me/calendarview')
//           // Add Prefer header to get back times in user's timezone
//           .header("Prefer", `outlook.timezone="${timeZone}"`)
//           // Add the begin and end of the calendar window
//           .query({
//             startDateTime: encodeURIComponent(start),
//             endDateTime: encodeURIComponent(end)
//           })
//           // Get just the properties used by the app
//           .select('subject,organizer,start,end')
//           // Order by start time
//           .orderby('start/dateTime')
//           // Get at most 50 results
//           .top(50)
//           .get();
//       },
//       // </GetCalendarViewSnippet>
    
//       // <CreateEventSnippet>
//       createEvent: async function(msalClient, userId, formData, timeZone) {
//         const client = getAuthenticatedClient(msalClient, userId);
    
//         // Build a Graph event
//         const newEvent = {
//           subject: formData.subject,
//           start: {
//             dateTime: formData.start,
//             timeZone: timeZone
//           },
//           end: {
//             dateTime: formData.end,
//             timeZone: timeZone
//           },
//           body: {
//             contentType: 'text',
//             content: formData.body
//           }
//         };
    
//         // Add attendees if present
//         if (formData.attendees) {
//           newEvent.attendees = [];
//           formData.attendees.forEach(attendee => {
//             newEvent.attendees.push({
//               type: 'required',
//               emailAddress: {
//                 address: attendee
//               }
//             });
//           });
//         }
    
//         // POST /me/events
//         await client
//           .api('/me/events')
//           .post(newEvent);
//       },
// };

// // GRAPH AUTH
// function getAuthenticatedClient = (accessToken) => {
//     // Initialize Graph client
//     const client = graph.Client.init({
//         // Use the provided access token to authenticate requests
//         authProvider: async (done) => {

//             try {
//                 // Get the user's account
//                 const account = await msalClient
//                   .getTokenCache()
//                   .getAccountByHomeId(userId);
        
//                 if (account) {
//                   // Attempt to get the token silently
//                   // This method uses the token cache and
//                   // refreshes expired tokens as needed
//                   const response = await msalClient.acquireTokenSilent({
//                     scopes: process.env.OAUTH_SCOPES.split(','),
//                     redirectUri: process.env.OAUTH_REDIRECT_URI,
//                     account: account
//                   });
        
//                   // First param to callback is the error,
//                   // Set to null in success case
//                   done(null, response.accessToken);
//                 }
//               } catch (err) {
//                 console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
//                 done(err, null);
//             }
            

//             // done(null, accessToken);
//         }
//     });

//     return client;
// };