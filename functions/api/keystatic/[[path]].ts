import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic'
import keystaticConfig from '../../../keystatic.config'

const handler = makeGenericAPIRouteHandler({
    config: keystaticConfig,
})

export const onRequest = async (context: any) => {
    return handler(context.request)
}
