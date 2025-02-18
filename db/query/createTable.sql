CREATE TABLE "User" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "mobile" VARCHAR(10) UNIQUE,
    "password" VARCHAR(255),
    "reset_token" VARCHAR(255), 
    "reset_token_expiry" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "deletedAt" TIMESTAMP NULL
);
