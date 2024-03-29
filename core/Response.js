class Response {
    constructor() {
        this.success = false;
        this.paging = {
            offset: 0,
            limit: 0,
            result: 0,
            total: 0
        };
        this.message = "";
        this.data = [];
        this.errorStatus = 0;
        this.errorType = "";
        this.errorMessage = "";
        this.headers = {
            'auth-token' : ""
        }
    }

    setSuccess (success = false){
        this.success = success;
    }
    setPaging (paging = {}){
        this.paging = paging;
    }
    setData (data = []){
        this.data = data;
    }
    setError (message, status, type){
        this.errorMessage = message;
        this.errorStatus = status;
        this.errorType = type;
    }

    setMessage (message = ""){
        this.message = message;
    }

    setHeadersToken (token = ""){
        this.headers['auth-token'] = token;       
    }
    

    get result(){
        return {    
            success: this.success,    
            // paging: this.paging,
            message: this.message,
            data: this.data,
            error: {
                status: this.errorStatus,
                type: this.errorType,
                message: this.errorMessage    
            }
        }
    }
  }
module.exports = Response;