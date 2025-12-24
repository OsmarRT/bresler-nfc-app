import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import User from './User';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'mini_offline_db',
  onSetUpError: error => {
    console.error('Database setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [User],
});
