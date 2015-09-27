import * as wpApi from '../../utils/wp-api';
import * as userModel from '../../models/user';

export function passthru(req, res) {
  const {method, query, body, params, session} = req;

  const user = userModel.getCurrentUser(session);

  const token = user ? user.access_token : null;

  const data = {...body, ...query};

  console.info('Request: [%s] %s', method, params[0], data);
  wpApi.makeRequest(params[0], method, data, token, (body, err, result) => {
    console.info('Response: [%d]', result.statusCode, body || null);

    switch (result.statusCode) {
      case 500:
        res.status(result.statusCode).json({msg: 'Upstream Error'});
        break;

      default:
        res.status(result.statusCode).json(body);
        break;
    }
  });

}
