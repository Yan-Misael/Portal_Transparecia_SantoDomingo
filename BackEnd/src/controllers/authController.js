const { sendSuccess, sendError } = require('../utils/responseHandler');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Registro de Administradores Municipales
const register = async (req, res) => {
    try {
        const { email, password, nombre, rol } = req.body;

        if (!email || !password || !nombre) {
            return sendError(res, 400, 'Faltan campos obligatorios (email, password, nombre)');
        }
        if (password.length < 6) {
            return sendError(res, 400, 'La contraseña debe tener al menos 6 caracteres');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, 'Formato de correo electrónico inválido');
        }

        // 1. Verificar si el usuario ya existe
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return sendError(res, 400, 'El correo ya está registrado en el municipio');
        }

        // 2. Encriptar la contraseña (seguridad JWT)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const rolUsuario = rol ? rol.toUpperCase() : 'ADMIN';

        // 3. Crear el usuario en PostgreSQL
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                nombre,
                rol: rolUsuario
            }
        });

        return sendSuccess(res, 201, { id: nuevoUsuario.id, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre }, 'Funcionario registrado con éxito');

    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Error interno del servidor al registrar usuario');
    }
};

// Inicio de sesión (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, 'El email y la contraseña son obligatorios');
        }

        // 1. Buscar al usuario
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return sendError(res, 401, 'Credenciales inválidas (email)');
        }

        // 2. Verificar la contraseña encriptada
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return sendError(res, 401, 'Credenciales inválidas (password)');
        }

        // 3. Generar el token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        const responseData = {
            token,
            usuario: { email: usuario.email, nombre: usuario.nombre, rol: usuario.rol }
        };
        return sendSuccess(res, 200, responseData, 'Autenticación exitosa');

    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Error interno del servidor al iniciar sesión');
    }
};

module.exports = { register, login };