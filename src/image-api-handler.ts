import * as fs from 'fs';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export function createBcmsApiImageHandler(): (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> {
  return async (req, res) => {
    try {
      const uri = '/' + `${req.url}`.split('/').slice(3).join('/');
      const result: AxiosResponse<{
        exist: boolean;
        path: string;
        mimetype: string;
        fileName: string;
        fileSize: number;
      }> = await axios({
        url: `http://localhost:3001/api/bcms-images${uri}`,
        method: (req.method as Method) || 'GET',
        headers: req.headers as { [name: string]: string },
      });
      if (result.data.exist) {
        res.statusCode = 200;
        res.setHeader('Content-Type', result.data.mimetype);
        // res.setHeader('Content-Length', result.data.fileSize);
        const readStream = fs.createReadStream(result.data.path);
        readStream.pipe(res, {
          end: true,
        });
        // const buffer = await fs.readFile(result.data.path);
        // res.write(buffer);
        // res.end();
        return;
      } else {
        res.statusCode = 404;
        console.warn(result);
        res.end();
      }
    } catch (error) {
      const err = error as AxiosError;
      const rez = err.response as AxiosResponse;
      res.statusCode = rez.status;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(rez.data));
      res.end();
    }
  };
}
