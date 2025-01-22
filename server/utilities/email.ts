import { mailtrapClient, sender } from "../config/mailTrap.config";
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "../constants/htmlEmail";

// --------------- FOR SENDING VERIFICATION OTP ---------------
export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html:htmlContent.replace("{verificationToken}", verificationToken),
            category: 'Email Verification'
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification")

    }
}

// --------------- FOR SENDING WELCOME EMAIL ---------------
export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Welcome to VedEats',
            html:htmlContent,
            template_variables:{
                company_info_name:"VedEats",
                name:name
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email")
    }
}

// --------------- FOR SENDING PASSWORD RESET EMAIL ---------------
export const sendPasswordResetEmail = async (email:string, resetURL:string) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html:htmlContent,
            category:"Reset Password"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password")
    }
}

// --------------- FOR SENDING PASSWORD RESET SUCCESS EMAIL ---------------
export const sendResetSuccessEmail = async (email:string) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Successfully',
            html:htmlContent,
            category:"Password Reset"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
}