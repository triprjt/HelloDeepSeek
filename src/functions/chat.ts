import { GSContext } from '@godspeedsystems/core';

export default async function (ctx: GSContext, args: any) {
  const {
    inputs: {
      data: { body },
    },
  } = ctx;
  const { prompt } = body;

  const ds = ctx.datasources.tokenjs;

  const response = await ds.execute(ctx, {
    prompt,
    meta: { fnNameInWorkflow: 'datasource.tokenjs.chat' },
  });

  return response;
}
