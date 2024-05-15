import path from 'path';
import { createFS } from '@banez/fs';
import type { BCMSClient } from '@becomes/cms-client/types';
import { createBcmsMost } from '@becomes/cms-most/main';
import type { BCMSMost } from '@becomes/cms-most/types';
import type {
  BCMSNextPlugin,
  BCMSNextPluginApiHandler,
} from 'next-plugin-bcms/types';

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
    const fs = createFS({
      base: process.cwd(),
    });
    // fs.exist('bcms').then(async (result) => {
    //   if (!result) {
    //     await bcmsMost.template.pull();
    //     await bcmsMost.content.pull();
    //     await bcmsMost.media.pull();
    //     await bcmsMost.typeConverter.pull();
    //   }
    // });
    fs.exist('bcms.routes.js', true).then(async (result) => {
      if (result) {
        const routes = await import(path.join(process.cwd(), 'bcms.routes.js'));
        bcmsMost.server.start(routes);
      }
    });
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
