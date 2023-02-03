const Response = require('../core/Response');

const exception = (message) => {
    
    const response = new Response();
    response.setData([]);
    response.setError(message,500,'INTERNAL_ERROR');
    response.setSuccess(false);
    return response.result;
} 

module.exports = exception;