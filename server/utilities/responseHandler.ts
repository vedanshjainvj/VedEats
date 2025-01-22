import statusCodeUtility from "./statusCodeUtility";

interface ResponseHandlerParams {
  statusCode?: number;
  message?: string;
  data?: any; 
  response: { 
    status: (code: number) => { send: (body: { message: string; data: any }) => void };
  };
}

const ResponseHandler = ({ statusCode = statusCodeUtility.Success, message = "Request Completed Successfully", 
  data = null, response }: ResponseHandlerParams): void => { response.status(statusCode).send({ message, data });};

export default ResponseHandler;
