import { createApplication } from 'graphql-modules';
import { authModule } from './auth';
import { postModule } from './post';
import { userModule } from './user';

const application = createApplication({
  modules: [authModule, postModule, userModule],
});

const { schema } = application;

export { application, schema };
