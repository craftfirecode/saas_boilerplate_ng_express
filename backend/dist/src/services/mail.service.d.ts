interface SendMailOptions {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    from?: string;
}
export declare function sendMail(options: SendMailOptions, attempt?: number): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export declare function sendVerificationMail(to: string, username: string, token: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export declare function sendEmailChangeMail(to: string, username: string, newEmail: string, token: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export declare function sendDeleteAccountMail(to: string, username: string, token: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export declare function sendPasswordResetMail(to: string, username: string, token: string): Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
export {};
