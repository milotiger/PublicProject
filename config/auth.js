module.exports = {
    facebookAuth : {
        client_id: '1656344187999501',
        client_secret: '86e7bbac72b4c2f9a6d8ccb1358152ed',
        callback_url: '/api/auth/facebook/callback',
        passReqToCallback : true,
        profileFields:['id', 'emails', 'name', 'displayName', 'gender', 'profileUrl', 'photos']
    }
};