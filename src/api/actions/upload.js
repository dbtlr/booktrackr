import * as wpApi from '../../utils/wp-api';
import * as wpConfig from '../../utils/wp-config';
import fs from 'fs';

export function uploadCover(req, res) {
  let fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename); 

    try {
      fstream = fs.createWriteStream('/tmp/file-' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.status(201).json({ msg: 'uploaded', file: filename, field: fieldname });
      });
    } catch (err) {
      console.error(err);
    }
  });
}
