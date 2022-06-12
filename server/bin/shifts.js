const graph = require('./graph');


module.exports = {
    shiftReqHandler: (req) => {
        
        if (req.body.action == "create"){

            const uri = `/teams/${req.body.teamId}/schedule/openShifts`;
            
            // call function
            createShift(
                req,
                uri,
                req.body.shiftData,
                req.body.end
            );

        } 
        else if (req.body.action == "delete") {
            const uri = `/teams/${req.body.teamId}/schedule/openShifts/$${req.body.shiftId}`;
            deleteShift(req,uri);
        } 
        else if (req.body.action == "get") {
            return getShifts(req, req.body.teamId, {
                shared: true,
                open: true
            });
        }

    },
    getAllShifts: (req,teamId) => {
        return getShifts(
            req, teamId, 
            {
            shared: true,
            open: true
            }
        );
    },
    getTeams: async (req) => {
        const client = graph.getAuthClient(req.app.locals.msalClient, req.session.userId,["team.readbasic.all"]);

        return await client
            .api('/me/joinedTeams')
            .headers({'Accept': 'application/json'})
            .get();
    }
};

function createShift(req,uri,cls,endDate) {
    
    cls.date = new Date(cls.date);
    const end = new Date(endDate);
    const client = graph.getAuthClient(req.app.locals.msalClient,req.session.userId,["Schedule.ReadWrite.All"]);
    // immediately invoked
        
    (async (client,uri,cls,end) => {
        while (cls.date<=end) {

            // make the API call using the provided graph client
            await client
                .api(uri)
                .headers({"Content-type": "application/json"})
                .post(cls);

            // increment by 1 week
            let newDate = cls.date.setDate(cls.date.getDate() + 7);
            cls.date = new Date(newDate); // update the date in the class data for next request
        }
    })(client,uri,cls,end);

    return true;
}
function deleteShift(req,uri) {
    const end = new Date(req.endDate);

}

function getShifts(req,teamId,conf) {
    // store results of both API calls
    let result = {};

    // confirm a configuration object was passed
    // to control what shifts are requested
    if (conf == undefined){
        console.log("No config provided for getShifts request");
        throw "No config object passed";
    } 

    const client = graph.getAuthClient(
        req.app.locals.msalClient,
        req.session.userId,
        ["schedule.read.all"]
    );

    if (conf.shared){
        result = Object.assign(result, 
            (async (teamId) => {
                let uri = `/teams/${teamId}/schedule/shifts`;
                // make the API call and await response
                return await client
                    .api(uri)
                    // .filter('sharedShift/startDateTime ge 2019-03-11T00:00:00.000Z and sharedShift/endDateTime le 2019-03-18T00:00:00.000Z and draftShift/startDateTime ge 2019-03-11T00:00:00.000Z and draftShift/endDateTime le 2019-03-18T00:00:00.000Z')
                    .get();
            })(teamId)
        );
    }
    if (conf.open){
        result = Object.assign(result, 
            (async (teamId) => {
                let uri = `/teams/${teamId}/schedule/openShifts`;
                // make the API call and await response
                return await client
                    .api(uri)
                    // .filter('sharedShift/startDateTime ge 2019-03-11T00:00:00.000Z and sharedShift/endDateTime le 2019-03-18T00:00:00.000Z and draftShift/startDateTime ge 2019-03-11T00:00:00.000Z and draftShift/endDateTime le 2019-03-18T00:00:00.000Z')
                    .get();
            })(teamId)
        );
    }

    return result;
}