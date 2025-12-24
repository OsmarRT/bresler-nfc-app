import { Q } from '@nozbe/watermelondb'
import { database } from '../db/database'
import User from '../db/User'

export const syncUsers = async () => {
  const users = await database.collections
    .get<User>('users')
    .query(Q.where('synced', false))
    .fetch()

  const names = users.map((u: User) => u.name)

  await fetch('http://localhost:5432/api/users/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(names)
  })

  await database.write(async () => {
    for (const u of users) {
      await u.update((user: User) => {
        user.synced = true
      })
    }
  })
}
