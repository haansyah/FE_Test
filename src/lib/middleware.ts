import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.redirect("/auth/login");
  }

  interface DecodedToken {
    role: string;
  }

  const tokenString = req.headers["authorization"] as string;

  jwt.verify(
    tokenString,
    "your-secret-key",
    {},
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.redirect("/auth/login");
      }

      const { role: userRole } = decoded as DecodedToken;

      if (userRole === "admin") {
        return res.redirect("/admin/dashboard");
      } else if (userRole === "masterdata") {
        return res.redirect("/admin/masterdata");
      } else {
        return res.redirect("/auth/login");
      }
    }
  );
};

export default authMiddleware;
