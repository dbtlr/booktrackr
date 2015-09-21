import * as wpApi from '../../utils/wp-api';

export function passthru(req, res) {
  const {method, query, body, params, session} = req;

  const token = session.oauth && session.oauth.access ? session.oauth.access : null;

  const data = {...body, ...query};

  wpApi.makeRequest(params[0], method, data, token, (body, err, result) => {
    res.status(result.statusCode).json(body);
  });

}