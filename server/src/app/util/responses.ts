/* eslint-disable @typescript-eslint/no-explicit-any */

class Responses {
    successResponse(message: string, data: any):any {
      return {
        status: true,
        message,
        data,
        error: null
      };
    }
  
    errorResponse(error: Error):any {
      return {
        status: false,
        message: error.message,
        data: null,
        error
      };
    }
  }
  
  export default new Responses();