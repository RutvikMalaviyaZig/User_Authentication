CREATE TABLE "Admin" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY , 
    "firstName" VARCHAR(255), 
    "lastName" VARCHAR(255), 
    "profileImgUrl" UUID NOT NULL, 
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "deletedAt" TIMESTAMP, 

    CONSTRAINT "fk_profileImgUrl" FOREIGN KEY ("profileImgUrl")
        REFERENCES "Media" ("id") ON DELETE CASCADE 
);