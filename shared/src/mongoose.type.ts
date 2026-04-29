type MongoMetaFields = "_id" | "createdAt" | "updatedAt";

export type WithoutMongoMeta<T> = Omit<T, MongoMetaFields>;
