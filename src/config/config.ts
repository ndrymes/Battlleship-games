import * as dotenv from 'dotenv'
dotenv.config()
const app_name: string = 'Test project TASKWORLD';

// call enviroment variables here
export const config = {
  app_name,
  port: process.env.PORT,
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE === 'true',
  },
};