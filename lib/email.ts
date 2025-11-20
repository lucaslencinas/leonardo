import { Resend } from 'resend';

// Initialize Resend lazily to ensure env vars are loaded
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale: string = 'en'
) {
  const resendClient = getResendClient();
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${locale}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const translations = {
    en: {
      subject: 'Verify your email for Baby Leo Predictions',
      heading: 'Verify Your Email',
      intro: 'Thanks for making a prediction for Baby Leo!',
      instructions: 'Click the button below to verify your email address and save your prediction:',
      button: 'Verify Email',
      footer: 'If you didn\'t make this request, you can safely ignore this email.',
      expires: 'This link will expire in 24 hours.',
    },
    'es-AR': {
      subject: 'Verifica tu email para las Predicciones de Baby Leo',
      heading: 'Verifica Tu Email',
      intro: '¡Gracias por hacer una predicción para Baby Leo!',
      instructions: 'Haz clic en el botón de abajo para verificar tu dirección de email y guardar tu predicción:',
      button: 'Verificar Email',
      footer: 'Si no realizaste esta solicitud, puedes ignorar este email de forma segura.',
      expires: 'Este enlace expirará en 24 horas.',
    },
    sv: {
      subject: 'Verifiera din e-post för Baby Leo-förutsägelser',
      heading: 'Verifiera Din E-post',
      intro: 'Tack för att du gjort en förutsägelse för Baby Leo!',
      instructions: 'Klicka på knappen nedan för att verifiera din e-postadress och spara din förutsägelse:',
      button: 'Verifiera E-post',
      footer: 'Om du inte gjorde denna begäran kan du ignorera detta e-postmeddelande.',
      expires: 'Denna länk kommer att upphöra om 24 timmar.',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  try {
    const { data, error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'Leonardo <noreply@babyleo.app>',
      to: email,
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${t.subject}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${t.heading}</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; margin-bottom: 20px;">${t.intro}</p>
              <p style="font-size: 16px; margin-bottom: 30px;">${t.instructions}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">${t.button}</a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">${t.expires}</p>
              <p style="font-size: 14px; color: #999; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">${t.footer}</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}
