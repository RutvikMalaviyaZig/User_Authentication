CREATE TABLE "Media" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY  , 
    "url" VARCHAR(255) NOT NULL, 
    "path" VARCHAR(255) NOT NULL, 
    "size" INTEGER NOT NULL, 
    "mimetype" VARCHAR(255) NOT NULL, 
    "originalname" VARCHAR(255) NOT NULL, 
    "createdAt" TIMESTAMP NOT NULL, 
    "updatedAt" TIMESTAMP NOT NULL, 
    "deletedAt" TIMESTAMP

);

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
