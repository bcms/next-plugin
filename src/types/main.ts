import type { BCMSMost } from '@becomes/cms-most/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface BCMSNextPluginApiHandler<Result = unknown> {
  (
    handler: (data: {
      req: NextApiRequest;
      res: NextApiResponse<Result>;
      bcms: BCMSMost;
    }) => Promise<Result>,
  ): (req: NextApiRequest, res: NextApiResponse<Result>) => Promise<void>;
}

export interface BCMSNextPlugin {
  most: BCMSMost;
}
