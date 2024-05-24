const dev = {
    API_ENDPOINT_URL: "http://localhost:8080",
    MEDIA_ENDPOINT_URL: "", 
    REACT_APP_GOOGLE_CLIENT_ID:'214562830543-ansop247kn34gotphasuh29poq5jdrob.apps.googleusercontent.com',
    PUBLIC_KEY:'test_public_key_0ce3197765dd4f2c83a1dd8157092006'
  };

  
  const prod = {
    API_ENDPOINT_URL: "",
    MEDIA_ENDPOINT_URL: "",
    REACT_APP_GOOGLE_CLIENT_ID:'214562830543-ansop247kn34gotphasuh29poq5jdrob.apps.googleusercontent.com',
    PUBLIC_KEY:'test_public_key_0ce3197765dd4f2c83a1dd8157092006'

  };
  
  const NODE_ENV = "development";
  
  
  const getEnv = () => {
    switch (NODE_ENV) {
      case "development":
        return dev;
      case "production":
        return prod;
      default:
        break;
    }
    
  };
  
  export const env = getEnv();
  