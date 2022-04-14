import {NextApiRequest}from 'next'
import formidable from "formidable";
export const parseForm = (req: NextApiRequest) => {
    var form = new formidable.IncomingForm();
    return new Promise(
      function (resolve, reject) {
        form.parse(req, (err, fields, files:formidable.Files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        })
      })
  }