import type { BCMSClient } from '@becomes/cms-client/types';
import { createBcmsMost } from '@becomes/cms-most';
import type { BCMSMost } from '@becomes/cms-most/types';
import type { BCMSNextPlugin, BCMSNextPluginApiHandler } from './types';

let nextPlugin: BCMSNextPlugin;

export function getBcmsClient(): BCMSClient {
  const plugin = createBcmsNextPlugin();
  return plugin.most.client;
}

export function getBcmsMost(): BCMSMost {
  const plugin = createBcmsNextPlugin();
  return plugin.most;
}

export function createBcmsApiHandler<
  Result = unknown,
>(): BCMSNextPluginApiHandler<Result> {
  const plugin = createBcmsNextPlugin();
  return (handler) => {
    return async (req, res) => {
      const result = await handler({ req, res, bcms: plugin.most });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Route does not exist.' } as never);
      }
    };
  };
}

export function createBcmsNextPlugin(): BCMSNextPlugin {
  if (!nextPlugin) {
    const bcmsMost = createBcmsMost();
    bcmsMost.socketConnect().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    });
    nextPlugin = {
      most: bcmsMost,
    };
  }
  return nextPlugin;
}

export const getBcmsNextPlugin = createBcmsNextPlugin;
