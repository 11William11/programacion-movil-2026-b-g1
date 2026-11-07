import jwt from 'jsonwebtoken';

/**
 * Login con JWT (semana 13).
 * Hay un solo usuario de prueba; sus datos y la firma del token vienen de la
 * configuración (variables de entorno en server.js), nunca del cliente.
 */
export function crearAuth({ usuario, contrasena, secreto, expiraEn }) {
  // POST /auth/login → { token } si el usuario y la contraseña son correctos
  function login(req, res) {
    const { usuario: u, contrasena: c } = req.body ?? {};
    if (typeof u !== 'string' || typeof c !== 'string' || !u || !c) {
      return res.status(400).json({ error: 'usuario y contrasena son obligatorios' });
    }
    if (u !== usuario || c !== contrasena) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ sub: usuario }, secreto, { expiresIn: expiraEn });
    res.json({ token });
  }

  // Middleware: deja pasar solo si llega "Authorization: Bearer <token>" válido y sin vencer
  function requiereToken(req, res, next) {
    const [tipo, token] = (req.headers.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Falta el token. Inicia sesión.' });
    }
    try {
      req.usuario = jwt.verify(token, secreto).sub;
      next();
    } catch {
      // Firma alterada o token vencido (jwt.verify revisa el campo exp)
      res.status(401).json({ error: 'Token inválido o vencido' });
    }
  }

  return { login, requiereToken };
}
