const { HttpStatus } = require('../enums');

function stripeResErr(err) {
  console.log('hehe');
  switch (err.type) {
    case 'StripeSignatureVerificationError':
      return { status: HttpStatus.FORBIDDEN, message: err.message, errInfo: err };

    default:
      return null;
  }
}

module.exports = stripeResErr;
