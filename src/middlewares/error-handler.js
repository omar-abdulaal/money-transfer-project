export default function errorHandler(error, request, response, next){
    console.log(error);
    // Check the mongodb internal errors
    if(error.code){
        if(+error.code === 11000){
            // duplication / confliction
            let message = '';
            const parts = [];
            const keys = Object.keys(error.keyValue);
            for(let key of keys){
                parts.push(`field '${key}' with the value '${error.keyValue[key]}'`);
            }
            message = `Duplicated value(s) in field(s): ${parts.join(',')}`;

            return response.status(409).json({
                success: false,
                message: message
            });
        }
    }

    // Check for custom errors originated from our code
    if(error.http_code){
        return response.status(error.http_code).json({
                success: false,
                message: error.message
            });
    }

    // Catch any error.
    return response.status(500).json({
        success: false,
        message: error
    })
}