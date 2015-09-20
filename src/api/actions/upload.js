import * as wpApi from '../../utils/wp-api';
import * as wpConfig from '../../utils/wp-config';
import fs from 'fs';

export function uploadCover(req, res) {

  const token = req.session.oauth && req.session.oauth.access ? req.session.oauth.access : null;

  let fstream;
  req.pipe(req.busboy);

  req.busboy.on('file', function (fieldname, file, filename) {
    try {
      const localFile = 'data/uploads/file-' + filename;
      fstream = fs.createWriteStream(localFile);
      file.pipe(fstream);
      fstream.on('close', function () {
        let rstream = fs.createReadStream(localFile)
        wpApi.uploadMedia(rstream, filename, fieldname, token, (body, err, result) => {
          // Clean up after ourself.
          fs.unlink(localFile);
          res.status(result.statusCode).json(body);
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({msg: 'There was an issue uploading the file'});
    }
  });
}
