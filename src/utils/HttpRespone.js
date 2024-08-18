export const ApiError = {
    GenericError: 1,
    UserNotFound: 2,
    UserNotLoggedIn: 3,
    EmailNotVerified: 4,
    TransactionFailed: 5,
    AlreadyExist: 6,
  };
  Object.freeze(ApiError);
  
  export class HttpUserError extends Error {
    constructor(message, errorCode) {
      super();
      this.message = message;
      if (errorCode) {
        this.errorCode = errorCode;
      }
    }
  
    responseObj() {
      return {
        errorCode: this.errorCode,
        message: this.message,
      };
    }
  }
  
  export class HttpApiError extends Error {
    constructor(status, message, errorCode) {
      super(message);
      this.status = status;
      this.errorCode = errorCode || ApiError.GenericError;
    }
  
    responseObj() {
      return {
        status: this.status,
        errorCode: this.errorCode,
        message: this.message,
      };
    }
  }
  
  export const getCodeIf401Error = (error) => {
    if (error instanceof HttpApiError && error.status == 401) {
      return error.errorCode;
    }
    return null;
  };
  
  export const HttpResponse = (data) => {
    return { data: data ? data : {} };
  };
  