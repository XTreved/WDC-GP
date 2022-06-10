const msid = require('../app').msid;
const appSettings = require('../appSettings');
const graphManager = require('../utils/graphManager');

/**
 * reqest format eg for shift:
 * const shift = {
  id: 'SHFT_577b75d2-a927-48c0-a5d1-dc984894e7b8',
  userId: 'c5d0c76b-80c4-481c-be50-923cd8d680a1',
  schedulingGroupId: 'TAG_228940ed-ff84-4e25-b129-1b395cf78be0',
  sharedShift: {
    displayName: 'Day shift',
    notes: 'Please do inventory as part of your shift.',
    startDateTime: '2019-03-11T15:00:00Z',
    endDateTime: '2019-03-12T00:00:00Z',
    theme: 'blue',
    activities: [
      {
        isPaid: true,
        startDateTime: '2019-03-11T15:00:00Z',
        endDateTime: '2019-03-11T15:15:00Z',
        code: '',
        displayName: 'Lunch'
      }
    ]
  },
  draftShift: {
    displayName: 'Day shift',
    notes: 'Please do inventory as part of your shift.',
    startDateTime: '2019-03-11T15:00:00Z',
    endDateTime: '2019-03-12T00:00:00Z',
    theme: 'blue',
    activities: [
      {
        isPaid: true,
        startDateTime: '2019-03-11T15:00:00Z',
        endDateTime: '2019-03-11T15:30:00Z',
        code: '',
        displayName: 'Lunch'
      }
    ]
  }
};
 * 
 * 
 */

module.exports = {
    shiftHandler: (req) => {

        var send = appSettings.protectedResources.graph_BASE; // copy the resource object from base definition
        var base = appSettings.protectedResources.graph_BASE.endpoint;
        
        if (req.body.action == "create"){

            const uri = `/teams/${req.body.teamId}/schedule/openShifts`;
            const url = base + uri;
            send.endpoint = url; // define url
            send.scopes.push("Schedule.ReadWrite.All"); // add permission scope
            
            // make path accessible
            appSettings.protectedResources[uri] = send;
    
            // get token
            msid.getToken({
                resource: send
            });

            // create the graph client, will be reused
            const graphClient = graphManager.getAuthenticatedClient(req.session.protectedResources[uri].accessToken);


            // call function
            createClass(
                graphClient,
                uri,
                req.body.shiftData,
                req.body.end
            );

            delete appSettings.protectedResources[uri]; // remove unique path from protectedResources

        } else if (req.body.action == "delete") {
            const uri = `/teams/${req.body.teamId}/schedule/openShifts/$${req.body.shiftId}`;
            deleteClass(req,uri);
        } else if (req.body.action == "get") {
            getAllShifts();
        }

    }
};

function createClass(graph,uri,cls,endDate){
    
    const end = new Date(endDate);

    // immediately invoked
        
    (async (graph,uri,cls,end) => {
        while (cls.date<=end) {

            // make the API call using the provided graph client
            await graph
                .api(uri)
                .headers({"Content-type": "application/json"})
                .post(cls);

            // increment by 1 week
            let newDate = cls.date.setDate(cls.date.getDate() + 7);
            cls.date = new Date(newDate); // update the date in the class data for next request
        }
    })(graph,uri,cls,end);

    return true;
}
function deleteClass(req,uri) {
    const end = new Date(req.endDate);

    // immediately invoked

    let graph = uri;
        
    (async (graph,uri,cls,end) => {
        while (cls.date<=end) {

            // make the API call using the provided graph client
            await graph
                .api(uri)
                .headers({"Content-type": "application/json"})
                .post(cls);

            // increment by 1 week
            let newDate = cls.date.setDate(cls.date.getDate() + 7);
            cls.date = new Date(newDate); // update the date in the class data for next request
        }
    })(graph,uri,req.body.cls,end);

    return true;
}

function getAllShifts(graph,uri,cls,endDate) {
    const end = new Date(endDate);

    // immediately invoked
    return (async (graph,uri,cls,end) => {
        // make the API call and await response
        return await graph
            .api(uri)
            .headers({"Content-type": "application/json"})
            .get();
    })(graph,uri,cls,end);
}
