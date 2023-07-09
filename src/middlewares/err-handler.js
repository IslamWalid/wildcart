const sendResErr = require('../utils/send-res-err');
const createResErr = require('../utils/res-err-creator');
const { HttpStatus, Messages } = require('../utils/enums');

const errHandler = async (err, req, res, next) => {
  const resErr = createResErr(err);

  if (!resErr.status) {
    return sendResErr(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: Messages.UNEXPECTED_ERROR,
      errInfo: err
    });
  }

  sendResErr(res, resErr);
};

module.exports = errHandler;
