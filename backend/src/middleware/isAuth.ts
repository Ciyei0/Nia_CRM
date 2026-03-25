import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";
import User from "../models/User";
import Company from "../models/Company";
import moment from "moment";

interface TokenPayload {
  sub?: string;
  email?: string;
  app_metadata?: {
    is_approved?: boolean;
    due_date?: string;
    plan?: string;
  };
}

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    // We use the same JWT Secret provided by the .env (which should now be the Supabase JWT Secret)
    const secretBuffer = Buffer.from(authConfig.secret, 'base64');
    const decoded = verify(token, secretBuffer) as TokenPayload;
    
    // Check if it's a Supabase JWT and enforce the central business rules
    if (decoded.app_metadata) {
      if (decoded.app_metadata.is_approved === false) {
         throw new AppError("Account pending approval", 403);
      }

      const dueDate = decoded.app_metadata.due_date;
      if (dueDate && moment().isAfter(moment(dueDate).endOf('day'))) {
         throw new AppError("Subscription expired", 403);
      }
    }

    // It is a valid Supabase token. Now map it to our local Users table by email.
    if (decoded.email) {
      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user) {
         throw new AppError("User not found in local database", 403);
      }

      // Sincronizar metadatos de Supabase hacia la tabla Company local.
      // Como el panel externo NIA Admin actualiza el app_metadata en Supabase,
      // usamos el JWT de Supabase como 'fuente de la verdad' para actualizar la empresa local.
      if (decoded.app_metadata) {
        const { is_approved, due_date } = decoded.app_metadata;
        
        // Bloquear acceso inmediato al dueño si no está aprobado
        // Only allow if explicitly true
        const isApproved = is_approved === true;
        if (!isApproved && user.profile === "admin") {
          throw new AppError("Account pending approval", 403);
        }

        if (user.companyId && (due_date !== undefined || is_approved !== undefined)) {
          const company = await Company.findByPk(user.companyId);
          if (company) {
            let needsUpdate = false;
            
            // Convertir fechas a un formato comparable o simplemente guardar el ISO
            if (due_date && company.dueDate !== due_date) {
              company.dueDate = due_date;
              needsUpdate = true;
            }
            if (is_approved !== undefined && company.status !== is_approved) {
              company.status = is_approved;
              needsUpdate = true;
            }

            if (needsUpdate) {
              await company.save();
            }

            // Bloqueo duro si expiró (común para toda la empresa)
            if (moment().isAfter(moment(company.dueDate).endOf('day'))) {
               throw new AppError("Subscription expired", 403);
            }
          }
        }
      }

      req.user = {
        id: user.id.toString(),
        profile: user.profile,
        companyId: user.companyId
      };
      return next();
    } else {
      // Legacy TokenPayload handling just in case (e.g. internal backend tokens)
      const { id, profile, companyId } = decoded as any;
      if (id && companyId) {
        req.user = { id: id.toString(), profile, companyId };
        return next();
      }
    }
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    // Si falla la verificación JWT o no es un JWT válido,
    // intentar buscar usuario por token (API Token permanente en la base de datos)
    const user = await User.findOne({ where: { token } });
    if (user) {
      req.user = {
        id: user.id.toString(),
        profile: user.profile,
        companyId: user.companyId
      };
      return next();
    }
    
    throw new AppError("Invalid token or session expired", 403);
  }

  return next();
};

export default isAuth;
