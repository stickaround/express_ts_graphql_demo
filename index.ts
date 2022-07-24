import mongoose from 'mongoose';

import { app } from './app';
import { logger } from './config/logger';
import { appConfig } from './config/constants';

mongoose
  .connect(appConfig.mongoose.url)
  .then(() => {
    logger.info('Connected to MongoDB');

    app.listen(appConfig.port, () => {
      logger.info(`App started on ${appConfig.port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });
