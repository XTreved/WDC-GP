const express = require('express');
const fetchManager = require('../utils/fetchManager');
const appSettings = require('../appSettings');

const graphPath = appSettings.protectedResources.graphAPI.endpoint;

    
// initialize router
const router = express.Router();

// auth routes
router.get('/ms/signin',
msid.signIn({
    postLoginRedirect: "/",
    failureRedirect: "/signin"
}),
);

router.get('/ms/signout',
msid.signOut({
    postLogoutRedirect: "/",
}),
);

// secure routes
router.get('/ms/id',   
msid.isAuthenticated(), // check if user is authenticated
function (req, res, next) {
const claims = {
name: req.session.account.idTokenClaims.name,
preferred_username: req.session.account.idTokenClaims.preferred_username,
oid: req.session.account.idTokenClaims.oid,
sub: req.session.account.idTokenClaims.sub
};

res.send({ isAuthenticated: req.session.isAuthenticated, claims: claims });
}
);

router.get('/ms/profile',
msid.isAuthenticated(), // check if user is authenticated
msid.getToken({
resource: msid.appSettings.protectedResources.graphAPI
}),
async function(req, res, next){
let profile;

try {
    profile = await fetchManager.callAPI.get(graphPath+"me", req.session.protectedResources["graphAPI"].accessToken);
    res.send(profile);        
} catch (error) {
    console.log(error);
    next(error);
}
}
);

router.get('/ms/joinedTeams',
msid.isAuthenticated(), // check if user is authenticated
msid.getToken({
resource: msid.appSettings.protectedResources.graphAPI
}),
async function(req, res, next){
let teams;

try {
    teams = await fetchManager.callAPI.get(graphPath+"me/joinedTeams", req.session.protectedResources["graphAPI"].accessToken);
    res.send(teams);        
} catch (error) {
    console.log(error);
    next(error);
}
}
);

// error
router.get('/error', (req, res) => res.redirect('/401.html'));

// unauthorized
router.get('/unauthorized', (req, res) => res.redirect('/500.html'));

// 404
router.get('*', (req, res) => res.redirect('/404.html'));

module.exports = router;