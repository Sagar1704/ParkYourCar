// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '691343320994640', // your App ID
        'clientSecret'  : '07dbdfe9b63943f6127de3d15e299cb0', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : '207149777751-fqg3echh070kr1g9raps2t71ld696bhm.apps.googleusercontent.com',
        'clientSecret'  : 'mUrA0J2Jv6UAGvVZ011TyIIQ',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};