// db/User.ts
import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  @field('name') name!: string
  @field('synced') synced!: boolean
}
