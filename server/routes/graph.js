const express = require('express');
const fetchManager = require('../utils/fetchManager');
const appSettings = require('../appSettings');
const graphManager = require('../utils/graphManager');

const shifts = require('../bin/shifts');

module.exports = (msid) => {

    // initialize router
    const router = express.Router();

    // authentication routes
    router.get('/graph/signin', msid.signIn({ postLoginRedirect: '/' }));
    router.get('/graph/signout', msid.signOut({ postLogoutRedirect: '/' }));

    // secure routes
    router.get('/graph/id', msid.isAuthenticated(), (req,res,next) => {
        let claims = {
            name: req.session.account.idTokenClaims.name,
            preferred_username: req.session.account.idTokenClaims.preferred_username,
            oid: req.session.account.idTokenClaims.oid,
            sub: req.session.account.idTokenClaims.sub
        };

        res.send({ isAuthenticated: req.session.isAuthenticated, claims: claims });
    });

    router.get('/graph/profile',
        msid.isAuthenticated(), 
        msid.getToken({
            resource: appSettings.protectedResources.profile
        }),
        async (req,res,next) => {
            let output;
            
            try {
                const graphClient = graphManager.getAuthenticatedClient(req.session.protectedResources["profile"].accessToken);

                output = await graphClient
                        .api('/me')
                        .get();

            } catch (error) {
                console.log(error);
                next(error);
            }
            res.send(output);
        }
    );
    
    router.get('/graph/joinedTeams',
        msid.isAuthenticated(),
        msid.getToken({
            resource: appSettings.protectedResources.joinedTeams
        }),
        async (req,res,next) => {
            let output;
            
            try {
                const graphClient = graphManager.getAuthenticatedClient(req.session.protectedResources["joinedTeams"].accessToken);

                output = await graphClient
                        .api('/me/joinedTeams')
                        .get();

            } catch (error) {
                console.log(error);
                next(error);
            }
            res.send(output);
        }
    );

    router.post('/graph/shift',
        msid.isAuthenticated(),
        async (req,res,next) => {
            shifts.shiftHandler(req);
        }
    );

    // unauthorized
    router.get('/error', (req, res) => res.redirect('/500.html'));

    // error
    router.get('/unauthorized', (req, res) => res.redirect('/graph/signin'));

    return router;
};