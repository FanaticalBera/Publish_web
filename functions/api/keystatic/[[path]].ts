import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic'
import keystaticConfig from '../../../keystatic.config'

export const onRequest = async (context: any) => {
    const handler = makeGenericAPIRouteHandler({
        config: keystaticConfig,
        clientId: context.env.KEYSTATIC_GITHUB_CLIENT_ID,
        clientSecret: context.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
        secret: context.env.KEYSTATIC_SECRET,
    })

    return handler(context.request)
}
