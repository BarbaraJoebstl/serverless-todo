import { APIGatewayProxyResult } from 'aws-lambda';

export class ApiResponse {
    
    public successResponse(statusCode: number, key: string, values: any): APIGatewayProxyResult {
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                [key]: values
            })
        }
    }
    
    // used deletion and update
    public emptySuccessResponse(): APIGatewayProxyResult {
        return {
            statusCode: 204,
            headers: {
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Credentials': true
        },
            body: null
        }
    }

    public errorResponse(statusCode: number, message: string): APIGatewayProxyResult {
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              message
            })
        }
    }
}