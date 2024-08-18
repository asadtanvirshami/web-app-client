import { HttpApiError, HttpUserError, ApiError } from "./HttpRespone";
import { Mongo } from "./mongo";

const lookForUser = async (token) => {
  let signupProvider = token.firebase?.sign_in_provider.split(".com")[0];
  signupProvider =
    signupProvider.charAt(0).toUpperCase() + signupProvider.slice(1);
  signupProvider = signupProvider === "Password" ? "Email" : signupProvider;
  let user = await Mongo.cacheGetUserObject({ email: token.email });
  if (!user) {
    console.info(
      `User: ${token.email} not found in db & cache. This should be a new user`
    );
    return null;
  }

  if (token.uid != user.firebaseUid) {
    // Note on emailVerified: if user's account lives in db already then keep
    // whatever is set in db. (most cases false) - only admin can manually set it
    // to true
    user = await Mongo.cachedUpdateUserObject({
      collection: "User",
      id: user._id,
      updateData: {
        firebaseUid: token.uid,
        signupProvider,
        emailVerified: signupProvider == "Email" ? user.emailVerified : true,
      },
    });
  }

  if (
    user.emailVerified == false &&
    (token.email_verified == true || signupProvider != "Email")
  ) {
    user = await Mongo.cachedUpdateUserObject({
      collection: "User",
      id: user._id,
      updateData: {
        emailVerified: true,
        signupProvider,
      },
    });
  }
  return user;
};

const verifyToken = async (req) => {
  try {
    let returnResult = { verified: false, data: null };
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const result = await getAuth(firebaseAdminAuth).verifyIdToken(token);
      returnResult.verified = true;
      returnResult.data = result;
    }
    return returnResult;
  } catch (err) {
    console.error(err);
    return { verified: false, data: null };
  }
};

// export const ensureEveryOne = (handler) => {
//   return async function (req, res) {
//     return handler(req, res);
//   };
// };

// export const ensureUser = (handler) => {
//   return async function (req, res) {
//     if (!req.tokenVerified) {
//       throw new HttpApiError(401, "User Not Found", ApiError.UserNotLoggedIn);
//     }
//     if (!req.user) {
//       throw new HttpUserError("User Not Found", ApiError.UserNotFound);
//     }
//     if (req.user.emailVerified === false && req.loggedIn !== true) {
//       throw new HttpUserError("User Not Found", ApiError.EmailNotVerified);
//     }
//     if (req.loggedIn !== true) {
//       throw new HttpApiError(
//         401,
//         "User not logged in",
//         ApiError.UserNotLoggedIn
//       );
//     }
//     return handler(req, res);
//   };
// };

// export const ensureCollaborators = async ({ course, user, courseId }) => {
//   if (user?.userType === 'Admin' || user?.userType === 'Author') {
//     return true;
//   } else {
//     if (!course) {
//       const course = await Mongo.findOne({
//         collection: 'Course',
//         query: { _id: courseId, collaborators: user.email },
//       });
//       if (course) {
//         return true;
//       }
//       throw new HttpApiError(
//         403,
//         `User ${user?.email} is not an Admin/collaborators`
//       );
//     } else {
//       const index = course.collaborators.findIndex((i) => i === user.email);
//       if (index >= 0) {
//         return true;
//       }
//       throw new HttpApiError(
//         403,
//         `User ${user?.email} is not an Admin/collaborators`
//       );
//     }
//   }
// };

// export const ensureAuthor = (handler) => {
//   return async function (req, res) {
//     if (req?.user?.emailVerified === false && req.loggedIn !== true) {
//       throw new HttpUserError('User Not Found', ApiError.EmailNotVerified);
//     }
//     if (req.loggedIn !== true) {
//       throw new HttpApiError(
//         401,
//         'User not logged in',
//         ApiError.UserNotLoggedIn
//       );
//     }
//     if (req.user?.userType != 'Admin' && req.user?.userType != 'Author') {
//       throw new HttpApiError(403, `User ${req.user?.email} is not an Admin`);
//     }
//     return handler(req, res);
//   };
// };

// export const ensureAdmin = (handler) => {
//   return async function (req, res) {
//     if (req?.user?.emailVerified === false && req.loggedIn !== true) {
//       throw new HttpUserError("User Not Found", ApiError.EmailNotVerified);
//     }
//     if (req.loggedIn !== true) {
//       throw new HttpApiError(
//         401,
//         "User not logged in",
//         ApiError.UserNotLoggedIn
//       );
//     }
//     if (req.user?.userType !== "Admin") {
//       throw new HttpApiError(403, `User ${req.user?.email} is not an Admin`);
//     }
//     return handler(req, res);
//   };
// };

// async function reportError(apiName, error, level, userEmail, userId) {
//   withScope(async (scope) => {
//     scope.setTag('Server', 'true');
//     scope.setTag('API', apiName);
//     scope.setLevel(level);
//     scope.setUser({
//       email: userEmail,
//       id: userId,
//     });
//     captureException(error);
//     await flush(2000);
//   });
// }

// export const withAuth = (handler) => {
//   return async function (req, res) {
//     let user = null;
//     const start = Date.now();
//     let ok = true;
//     let httpStatus = 200;
//     const apiName = `${handler.name}(${req.method})`;
//     try {
//       const { verified, data } = await verifyToken(req);
//       user = verified === true ? await lookForUser(data) : null;
//       req.emailVerified = data?.email_verified === true ? true : false;
//       req.tokenVerified = verified;
//       req.loggedIn =
//         verified === true && user && user.emailVerified == true ? true : false;

//       req.user = user;
//       return await handler(req, res);
//     } catch (error) {
//       ok = false;
//       const nonCriticalError =
//         error instanceof HttpUserError || error instanceof HttpApiError;
//       if (nonCriticalError) {
//         const errorType = error.constructor.name;
//         console.log(
//           `${errorType}. errorCode: ${error?.errorCode}. msg: ${error.message}`
//         );
//         await reportError(
//           apiName,
//           error,
//           'warning',
//           user?.email,
//           user?.firebaseUid
//         );

//         if (error instanceof HttpUserError) {
//           res.status(200).json({ userError: error.responseObj() });
//         } else {
//           httpStatus = error.status;
//           res.status(error.status).json({ apiError: error.responseObj() });
//         }
//       } else {
//         console.error(
//           error,
//           `INTERNAL SERVER ERROR. User: ${user?.email}. Referer: ${req?.headers?.referer}`
//         );
//         await reportError(
//           apiName,
//           error,
//           'error',
//           user?.email,
//           user?.firebaseUid
//         );
//         httpStatus = 500;
//         res.status(500).send({});
//       }
//     } finally {
//       const timeTaken = Date.now() - start;
//       const message =
//         `API-Server: ${req.url} - ${apiName}. User: ${user?.email}. UserType: ${user?.userType}. ` +
//         `Succeeded: ${ok}. HttpStatus: ${httpStatus}. Time: ${timeTaken}ms.`;
//       console.log(message);
//       if (timeTaken >= 15000) {
//         await reportError(
//           apiName,
//           new Error(`Slow request: ${message}`),
//           'warning',
//           user?.email,
//           user?.firebaseUid
//         );
//       }
//     }
//   };
// };
