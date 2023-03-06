export class Config {
    constructor() {
      if (!Config.instance) {
        Config.instance = this;
      }
  
      return Config.instance;
    }

    auth(){
      return JSON.parse(localStorage.getItem('auth'))
    }

    headers(){
      return {
        "Accept": "*/*",
        "Content-Type": "application/json",
        authorization: `Bearer ${JSON.parse(localStorage.getItem('auth')).token}`
       }
    }
  
    decimales(){
        return 3;
    }

}