import * as wpApi from '../../utils/wp-api';
import * as userModel from '../../models/user';

export function passthru(req, res) {
  const {method, query, body, params, session} = req;

  const user = userModel.getCurrentUser(session);

  const token = user ? user.access_token : null;

  const data = {...body, ...query};

  wpApi.makeRequest(params[0], method, data, token, (body, err, result) => {
    res.status(result.statusCode).json(body);
  });

}