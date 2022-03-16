import * as fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBcmsMost } from './main';

export function createBcmsApiImageHandler(): (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> {
  return async (req, res) => {
    const most = getBcmsMost();
    const uri = '/' + `${req.url}`.split('/').slice(3).join('/');
    const result = await most.imageProcessor.middlewareHelper(uri);
    if (result.exist) {
      res.statusCode = 200;
      res.setHeader('Content-Type', result.mimetype as string);
      const readStream = fs.createReadStream(result.path as string);
      readStream.pipe(res, {
        end: true,
      });
    } else {
      res.statusCode = 404;
      // eslint-disable-next-line no-console
      console.warn(result);
      res.end();
    }
  };
}
