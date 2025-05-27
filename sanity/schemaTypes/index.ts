import { type SchemaTypeDefinition } from 'sanity'
import bodyShopOwner from '../schemas/bodyShopOwner'
import vehicle from '../schemas/vehicle'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [bodyShopOwner, vehicle],
}
