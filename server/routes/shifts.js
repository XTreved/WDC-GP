const router = require('express-promise-router')();
const shiftsMod = require('../bin/shifts');

router.get('/joinedTeams', async (req,res,next) => {
    let teams = await shiftsMod.getTeams(req);
    res.send(teams);
});

router.get('/get', (req,res,next) => {
    // let shifts = shiftMod.getAllShifts(req,req);
});

router.post('/update', async(req,res,next)=>{
    // input validation
    // pass validated input to the shiftReqHandler
});

module.exports = router;