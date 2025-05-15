import { DurableObject } from 'cloudflare:workers';
import { Browsable, studio } from '@outerbase/browsable-durable-object';

@Browsable()
export class MyDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (import.meta.env.DEV && url.pathname === '/studio') {
			return await studio(request, env.MY_DURABLE_OBJECT, {
				basicAuth: {
					username: 'admin',
					password: 'admin',
				},
			});
		}

		return new Response('Not Found', {
			status: 404,
		});
	},
} satisfies ExportedHandler<Env>;
