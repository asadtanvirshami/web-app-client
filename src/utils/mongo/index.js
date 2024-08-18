import Admin from "../../models/admin";
import { dbConnect, dbDisconnect } from "../dBConnect";
dbConnect();

const collectionsTable = {
  Admin: Admin,
};

const logTime = async (query) => {
  const start = Date.now();
  try {
    return await query;
  } finally {
    const timeTaken = Date.now() - start;
    console.log(`MONGO: ${query}. Time taken: ${timeTaken}ms`);
  }
};

export const MongoDisconnect = () => {
  return dbDisconnect();
};

const getModel = (collection) => {
  return collectionsTable[collection];
};

export const Mongo = {
  create: async ({ collection, object }) => {
    const model = getModel(collection);
    return await logTime(new model(object).save());
  },

  //   upsert: async ({ collection, query, updateData }) => {
  //     updateData.updatedAt = Date.now();
  //     const model = getModel(collection);
  //     return await logTime(
  //       model.findOneAndUpdate(
  //         query,
  //         { $set: updateData },
  //         { new: true, upsert: true }
  //       )
  //     );
  //   },

  //   updateOneWithQuery: async ({
  //     collection,
  //     query,
  //     updateData,
  //     returnField,
  //   }) => {
  //     updateData.updatedAt = Date.now();
  //     const model = getModel(collection);
  //     return await logTime(
  //       model.findOneAndUpdate(
  //         query,
  //         { $set: updateData },
  //         { new: true, select: returnField }
  //       )
  //     );
  //   },

  //   updateOne: async ({
  //     collection,
  //     id,
  //     updateData,
  //     returnField,
  //     verifyUpdatedAt,
  //   }) => {
  //     const query = { _id: id };
  //     if (verifyUpdatedAt) {
  //       query.updatedAt = verifyUpdatedAt;
  //     }
  //     return await Mongo.updateOneWithQuery({
  //       collection,
  //       query,
  //       updateData,
  //       returnField,
  //     });
  //   },

  //   updateOneWithOptions: async ({
  //     collection,
  //     id,
  //     updateData,
  //     options = {},
  //   }) => {
  //     if (!options || options.timestamps !== false) {
  //       if (updateData.$set) {
  //         updateData.$set.updatedAt = Date.now();
  //       } else {
  //         updateData.$set = { updatedAt: Date.now() };
  //       }
  //     }
  //     const model = getModel(collection);
  //     return await logTime(
  //       model.findOneAndUpdate({ _id: id }, updateData, {
  //         new: true,
  //         ...options,
  //       })
  //     );
  //   },

  //   updateOneWithQueryAndOptions: async ({
  //     collection,
  //     query,
  //     updateData,
  //     options = {},
  //   }) => {
  //     const model = getModel(collection);
  //     return await logTime(
  //       model.findOneAndUpdate(query, updateData, {
  //         new: true,
  //         ...options,
  //       })
  //     );
  //   },

  //   updateMany: async ({ collection, query, updateData }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.updateMany(query, updateData, { new: true }));
  //   },

  //   findAll: async ({ collection, query, returnField, limit, sort }) => {
  //     const model = getModel(collection);
  //     return await logTime(
  //       model.find(query, returnField)?.limit(limit)?.sort(sort)
  //     );
  //   },

  findOne: async ({ collection, query, returnField }) => {
      const model = getModel(collection);
      console.log(collection, query, returnField );
    return await logTime(model.findOne(query, returnField));
  },

  //   findOneWithPopulate: async ({ collection, query, populate, returnField }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.findOne(query, returnField).populate(populate));
  //   },

  //   findWithPopulate: async ({ collection, query, populate, returnField }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.find(query, returnField).populate(populate));
  //   },

  //   deleteOne: async ({ collection, id }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.deleteOne({ _id: id }));
  //   },

  //   deleteMany: async ({ collection, query }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.deleteMany(query));
  //   },

  //   aggregate: async ({ collection, query }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.aggregate(query));
  //   },

  //   insertMany: async ({ collection, insertData }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.insertMany(insertData));
  //   },

  //   bulkWrite: async ({ collection, writeData }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.bulkWrite(writeData));
  //   },

  //   paginate: async ({ collection, options, query }) => {
  //     const model = getModel(collection);
  //     return await logTime(model.paginate(query, options));
  //   },

  //   cacheGetUserObject: async ({ email, forceSyncRefresh }) => {
  //     const args = { collection: 'User', query: { email: email } };

  //     if (DISABLE_USER_OBJECT_CACHE) {
  //       return await Mongo.findOne(args);
  //     }

  //     let user = await withCache({
  //       fn: async () => {
  //         console.log(
  //           `Refreshing user's cached object: ${email}. forceSync: ${
  //             forceSyncRefresh == true
  //           }`
  //         );
  //         return await Mongo.findOne(args);
  //       },
  //       unique_scope: 'Mongo.findOne',
  //       cacheKey: JSON.stringify(args),
  //       refreshAfterSecs: USER_OBJECT_CACHE_SECS,
  //       forceSyncRefresh: forceSyncRefresh,
  //     });
  //     if (user) {
  //       console.log(
  //         `Got User's object from cache: ${user?.email}. size: ${
  //           JSON.stringify(user).length
  //         }`
  //       );
  //     }
  //     return user;
  //   },

  //   cachedUpdateUserObject: async ({ collection, id, updateData }) => {
  //     let user = await Mongo.updateOne({ collection, id, updateData });
  //     if (!user) {
  //       console.warn(`Unable to update user: ${id}. Not updating cache`);
  //       return null;
  //     }

  //     if (DISABLE_USER_OBJECT_CACHE) {
  //       return user;
  //     }

  //     user = JSON.parse(JSON.stringify(user));
  //     const cacheKeyArgs = { collection: 'User', query: { email: user.email } };

  //     return await withCache({
  //       fn: () => {
  //         console.log(`Updating user's cached object: ${user.email}`);
  //         return user;
  //       },
  //       unique_scope: 'Mongo.findOne',
  //       cacheKey: JSON.stringify(cacheKeyArgs),
  //       refreshAfterSecs: USER_OBJECT_CACHE_SECS,
  //       forceSyncRefresh: true,
  //     });
  //   },
};
