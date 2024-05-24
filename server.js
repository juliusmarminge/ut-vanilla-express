import cors from 'cors';

import 'dotenv/config';

import express from 'express';
import logger from 'morgan';

import { createRouteHandler, createUploadthing } from 'uploadthing/express';

const f = createUploadthing({
  /**
   * Log out more information about the error, but don't return it to the client
   * @see https://docs.uploadthing.com/errors#error-formatting
   */
  errorFormatter: (err) => {
    console.log('Error uploading file', err.message);
    console.log('  - Above error caused by:', err.cause);

    return { message: err.message };
  },
});

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const uploadRouter = {
  videoAndImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
    video: {
      maxFileSize: '16MB',
    },
  }).onUploadComplete((data) => {
    console.log('upload completed', data);
  }),
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('combined'));
app.use(cors());
app.set('json spaces', 1);

// CDN
app.use(
  '/cdn/api/uploadthing',
  createRouteHandler({
    router: uploadRouter,
  })
); // DONT REMOVE "/API" ITS IMPORTANT

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(
    `[^] Server is running on port ${PORT} in ${
      process.env.NODE_ENV || 'developement'
    } mode`
  );
});
