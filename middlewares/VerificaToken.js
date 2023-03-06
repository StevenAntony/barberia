
const jwt = require("jsonwebtoken");
// Middleware para verificar el token
const VerificarToken = (req, res, next) => {
    // Obtener el token de los encabezados de la solicitud
    if (!(req.headers.authorization == undefined)) {
      const token = req.headers.authorization.split(' ')[1];
      // Verificar el token
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ mensaje: 'Token inválido' });
        } else {
          // El token es válido, continuar con la solicitud
          req.auth = decoded;
          next();
        }
      });
    }else{
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
    
};  

module.exports = VerificarToken;
