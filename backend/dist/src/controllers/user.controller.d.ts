import { Request, Response } from 'express';
export declare function updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function requestEmailUpdate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function confirmEmailUpdate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function requestAccountDeletion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function confirmAccountDeletion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function requestPasswordResetHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function confirmPasswordResetHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
