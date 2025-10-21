import 'server-only'; // ← C'est tout !

import { ContactFormData } from '@/zodSchema/contactPage/contactSchema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer un email de reset password
export const sendPasswordReset = async (
  email: string,
  resetLink: string,
  username: string
) => {
  try {
    //dans resetLink on a le token integrer dans l'url
    if (!resetLink) {
      throw new Error('No reset link provided');
    }

    if (!email) {
      throw new Error('No email provided');
    }

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bonjour ${username} !</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <p>Cordialement,<br>L'équipe de votre application</p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de reset password:",
      error
    );
    throw error;
  }
};

// Un exemple de fonction pour envoyer un email de vérification
export const sendEmailVerification = async (
  email: string,
  token: string,
  username: string,
  url: string
) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    if (!email) {
      throw new Error('No email provided');
    }

    const confirmLink = url;

    const result = await resend.emails.send({
      from: 'Lastmodel <boilerplate@lakka.blue>',
      to: email,
      subject: '💖 Bienvenue sur Lastmodel ! Confirmez votre email',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #fef2f4 0%, #fce7f3 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15);">

                  <!-- Header avec gradient rose/rouge et animation -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ec4899 0%, #dc2626 100%); padding: 56px 40px; text-align: center; position: relative;">
                      <!-- Cercles décoratifs -->
                      <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                      <div style="position: absolute; bottom: -30px; left: -30px; width: 120px; height: 120px; background-color: rgba(255, 255, 255, 0.08); border-radius: 50%;"></div>

                      <!-- Icône principale -->
                      <div style="position: relative; background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%); width: 110px; height: 110px; border-radius: 50%; margin: 0 auto 28px; padding: 25px; backdrop-filter: blur(10px); border: 3px solid rgba(255, 255, 255, 0.3);">
                        <span style="font-size: 60px; line-height: 1; display: block;">🎉</span>
                      </div>

                      <h1 style="color: #ffffff; margin: 0 0 12px 0; font-size: 36px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                        Bienvenue ${username} !
                      </h1>
                      <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 18px; font-weight: 500; letter-spacing: 0.3px;">
                        Vous êtes à un clic de rejoindre Lastmodel
                      </p>
                    </td>
                  </tr>

                  <!-- Contenu principal -->
                  <tr>
                    <td style="padding: 52px 40px;">
                      <!-- Message de bienvenue -->
                      <div style="text-align: center; margin-bottom: 36px;">
                        <p style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; line-height: 1.6; font-weight: 600;">
                          Nous sommes ravis de vous accueillir ! 💕
                        </p>
                        <p style="color: #64748b; margin: 0; font-size: 15px; line-height: 1.7;">
                          Pour commencer votre aventure et découvrir des rencontres authentiques, veuillez confirmer votre adresse email.
                        </p>
                      </div>

                      <!-- Bouton CTA principal avec effet wow -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 36px 0;">
                        <tr>
                          <td align="center" style="padding: 8px 0;">
                            <a href="${confirmLink}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 20px 56px; border-radius: 16px; font-weight: 700; font-size: 17px; box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4), 0 2px 8px rgba(220, 38, 38, 0.3); transition: all 0.3s ease; letter-spacing: 0.3px;">
                              ✨ Confirmer mon email
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Info box avec icône -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 24px; margin: 0 0 36px 0; border-left: 5px solid #3b82f6;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.7;">
                              <span style="font-size: 20px; display: block; margin-bottom: 8px;">⏱️</span>
                              <strong style="display: block; margin-bottom: 6px; font-size: 15px;">Action requise</strong>
                              Ce lien de confirmation est valable pendant <strong>1 heure</strong>. Après ce délai, vous devrez demander un nouvel email de vérification.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Ce qui vous attend -->
                      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 28px; margin: 0 0 36px 0; border-left: 5px solid #f59e0b;">
                        <p style="margin: 0 0 16px 0; color: #92400e; font-size: 16px; font-weight: 700;">
                          🌟 Ce qui vous attend sur Lastmodel :
                        </p>
                        <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                          <li style="margin-bottom: 8px;">Des rencontres authentiques et vérifiées</li>
                          <li style="margin-bottom: 8px;">Un algorithme intelligent pour des matchs parfaits</li>
                          <li style="margin-bottom: 8px;">Une communauté bienveillante et moderne</li>
                          <li>Des fonctionnalités innovantes pour faciliter les échanges</li>
                        </ul>
                      </div>

                      <!-- Lien de secours stylé -->
                      <div style="background-color: #f8fafc; border-radius: 16px; padding: 28px; border: 2px dashed #cbd5e1;">
                        <p style="margin: 0 0 14px 0; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                          🔧 Le bouton ne fonctionne pas ?
                        </p>
                        <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                          Copiez et collez ce lien dans votre navigateur :
                        </p>
                        <div style="background-color: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0; word-break: break-all;">
                          <p style="margin: 0; color: #ec4899; font-size: 12px; font-family: 'Courier New', monospace; line-height: 1.6;">
                            ${confirmLink}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Divider élégant -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);"></div>
                    </td>
                  </tr>

                  <!-- Footer avec message de sécurité -->
                  <tr>
                    <td style="padding: 40px;">
                      <!-- Box sécurité -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 16px; padding: 20px; margin: 0 0 28px 0; border-left: 5px solid #dc2626;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.7;">
                              <span style="font-size: 18px; display: block; margin-bottom: 8px;">🛡️</span>
                              <strong style="display: block; margin-bottom: 6px;">Sécurité</strong>
                              Vous n'avez pas créé de compte sur Lastmodel ? Ignorez simplement cet email. Votre adresse ne sera pas utilisée sans votre confirmation.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Signature -->
                      <p style="margin: 0; color: #64748b; font-size: 15px; text-align: center; line-height: 1.7;">
                        Avec amour,<br>
                        <strong style="color: #ec4899; font-size: 16px;">L'équipe Lastmodel</strong> 💕
                      </p>
                    </td>
                  </tr>

                  <!-- Footer final -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 28px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                      </p>
                      <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                        © ${new Date().getFullYear()} Lastmodel. Tous droits réservés.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification:", error);
    throw error;
  }
};

// Fonction pour envoyer un magic link
export const sendMagicLinkAction = async ({
  email,
  url,
}: {
  email: string;
  url: string;
}) => {
  try {
    if (!email) {
      throw new Error('No email provided');
    }

    if (!url) {
      throw new Error('No URL provided');
    }

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: email,
      subject: '🔐 Votre lien de connexion magique',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                  <!-- Header avec gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
                      <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px;">🔐</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Connexion Magique
                      </h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 16px; font-weight: 400;">
                        Accédez à votre compte en un clic
                      </p>
                    </td>
                  </tr>

                  <!-- Contenu principal -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      <p style="color: #1e293b; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                        Bonjour ! 👋
                      </p>

                      <p style="color: #475569; margin: 0 0 32px 0; font-size: 15px; line-height: 1.7;">
                        Vous avez demandé un lien de connexion sécurisé. Cliquez sur le bouton ci-dessous pour vous connecter instantanément à votre compte.
                      </p>

                      <!-- Bouton CTA avec effet hover -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 0 0 32px 0;">
                            <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                              ✨ Se connecter maintenant
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Info box sécurité -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                              <strong style="display: block; margin-bottom: 8px;">⏱️ Attention :</strong>
                              Ce lien expirera dans <strong>15 minutes</strong> pour votre sécurité.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Lien de secours -->
                      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 2px dashed #e2e8f0;">
                        <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                          Le bouton ne fonctionne pas ?
                        </p>
                        <p style="margin: 0 0 8px 0; color: #475569; font-size: 13px;">
                          Copiez et collez ce lien dans votre navigateur :
                        </p>
                        <p style="margin: 0; word-break: break-all; color: #0ea5e9; font-size: 12px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                          ${url}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="border-top: 1px solid #e2e8f0;"></div>
                    </td>
                  </tr>

                  <!-- Footer avec avertissement sécurité -->
                  <tr>
                    <td style="padding: 32px 40px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2; border-radius: 12px; padding: 16px;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                              <strong>🛡️ Sécurité :</strong> Si vous n'avez pas demandé cette connexion, ignorez cet email. Votre compte reste sécurisé.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; text-align: center; line-height: 1.6;">
                        Cordialement,<br>
                        <strong style="color: #1e293b;">L'équipe de votre application</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer gris -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi du magic link:", error);
    throw error;
  }
};

// Fonction pour envoyer un email de changement d'email
export const changeEmailVerification = async (
  email: string,
  token: string,
  username: string,
  url: string,
  newEmail: string
) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    if (!email) {
      throw new Error('No email provided');
    }

    const confirmLink = url;

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: email,
      subject: "Confirmez votre changement d'email",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🔐 Changement d'email
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Confirmez votre nouvelle adresse email
            </p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Bonjour ${username} ! 👋
            </h2>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Vous avez demandé à changer votre adresse email de <strong>${email}</strong> vers <strong>${newEmail}</strong>.
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                ✅ Confirmer le changement d'email
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                ⚠️ <strong>Important :</strong> Si vous n'avez pas demandé ce changement, ignorez cet email et contactez notre support.
              </p>
            </div>
            
            <!-- Fallback Link -->
            <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien :
              </p>
              <p style="margin: 0; word-break: break-all; color: #3b82f6; font-size: 12px; font-family: monospace; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
                ${confirmLink}
              </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Ce lien expirera dans <strong>24 heures</strong> pour votre sécurité.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              Cordialement,<br>
              <strong style="color: #1e293b;">L'équipe de votre application</strong>
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de changement d'email:",
      error
    );
    throw error;
  }
};

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, subject, message } = data;

  if (!name) {
    throw new Error('No name provided');
  }

  if (!email) {
    throw new Error('No email provided');
  }

  if (!subject) {
    throw new Error('No subject provided');
  }

  if (!message) {
    throw new Error('No message provided');
  }

  try {
    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: 'battosai78@gmail.com', // ton email
      subject: `Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nouveau message de contact</h2>
          <p><strong>De:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <hr style="margin: 20px 0; border: 1px solid #eee;">
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    throw error;
  }
}
