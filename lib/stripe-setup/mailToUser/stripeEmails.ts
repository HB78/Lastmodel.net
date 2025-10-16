import { prisma } from '@/lib/prisma-setup/db';
import { Resend } from 'resend';
import Stripe from 'stripe';

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer un email de confirmation de paiement
export const sendInvoiceEmail = async (invoice: Stripe.Invoice) => {
  try {
    // Récupérer l'email du client depuis Stripe
    const customerEmail =
      typeof invoice.customer_email === 'string'
        ? invoice.customer_email
        : null;

    if (!customerEmail) {
      console.error('No customer email found in invoice');
      return;
    }

    const amountPaid = (invoice.amount_paid / 100).toFixed(2); // Convertir centimes en euros
    const currency = invoice.currency.toUpperCase();
    const invoiceNumber = invoice.number || invoice.id;
    const invoicePdf = invoice.invoice_pdf || '#';

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: customerEmail,
      subject: `Confirmation de paiement - Facture ${invoiceNumber}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              ✅ Paiement confirmé
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Merci pour votre paiement
            </p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Bonjour ! 👋
            </h2>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Nous avons bien reçu votre paiement. Voici les détails de votre facture :
            </p>

            <!-- Invoice Details -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Facture n°</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; text-align: right;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant payé</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: 700; text-align: right; font-size: 18px;">${amountPaid} ${currency}</td>
                </tr>
              </table>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoicePdf}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                📄 Télécharger la facture
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Merci de votre confiance !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              Cordialement,<br>
              <strong style="color: #1e293b;">L'équipe Last</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      'Email de confirmation de paiement envoyé avec succès à:',
      customerEmail
    );
    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de confirmation de paiement:",
      error
    );
    throw error;
  }
};

// Fonction pour envoyer un email d'échec de paiement
export const sendPaymentFailedEmail = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  try {
    // Récupérer l'email du client
    const customer = paymentIntent.customer;
    if (!customer || typeof customer !== 'string') {
      console.error('No customer found in payment intent');
      return;
    }

    // Note: Vous devrez récupérer l'email du client depuis votre BDD
    // car paymentIntent ne contient que l'ID du customer
    // Pour l'instant, on skip si pas d'email dans les metadata
    const customerEmail = paymentIntent.receipt_email;

    if (!customerEmail) {
      console.error('No customer email found in payment intent');
      return;
    }

    const amount = (paymentIntent.amount / 100).toFixed(2);
    const currency = paymentIntent.currency.toUpperCase();

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: customerEmail,
      subject: '⚠️ Échec de paiement - Action requise',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              ⚠️ Échec de paiement
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Votre paiement n'a pas pu être traité
            </p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Bonjour ! 👋
            </h2>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Malheureusement, nous n'avons pas pu traiter votre paiement de <strong>${amount} ${currency}</strong>.
            </p>

            <!-- Reasons -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600;">Raisons possibles :</p>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li>Fonds insuffisants</li>
                <li>Carte expirée</li>
                <li>Informations de carte incorrectes</li>
                <li>Limite de dépense atteinte</li>
              </ul>
            </div>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Pour continuer à profiter de votre abonnement, veuillez mettre à jour vos informations de paiement.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.BETTER_AUTH_URL}/pricing" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                🔄 Mettre à jour le paiement
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Besoin d'aide ? Contactez notre support.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              Cordialement,<br>
              <strong style="color: #1e293b;">L'équipe Last</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      "Email d'échec de paiement envoyé avec succès à:",
      customerEmail
    );
    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email d'échec de paiement:",
      error
    );
    throw error;
  }
};

// Fonction pour envoyer un email de bienvenue après souscription
export const sendWelcomeEmail = async (
  referenceId: string,
  planName: string
) => {
  try {
    // Récupérer l'utilisateur depuis la BDD
    const user = await prisma.user.findUnique({
      where: { id: referenceId },
      select: { email: true, name: true },
    });

    if (!user) {
      console.error('User not found for referenceId:', referenceId);
      return;
    }

    // Détails du plan
    //ici on crée un grand objet qu'on type grace a un record
    const planDetails: Record<string, { title: string; features: string[] }> = {
      MONTHLY: {
        title: 'Plan Mensuel',
        features: [
          'Votre profil est visible dans les recherches',
          'Les visiteurs peuvent liker votre profil',
          'Upload de 11 photos',
          'Mis en avant dans les résultats',
        ],
      },
      YEARLY: {
        title: 'Plan Annuel Premium',
        features: [
          'Badge premium visible',
          'Profil prioritaire dans les recherches',
          'Upload de 11 photos',
          'Toutes les fonctionnalités mensuelles',
          '2 mois gratuits offerts',
        ],
      },
    };

    //Ici on dit a typescript tkt le planName qui arrive fait partie du tableau planDetails
    //On associe le nom du plan qui arrive au tableau et donc on peut faire de la recherche
    //On ne peut pas faire plan.title car on recoit une string et pour chercher dans le tableau avec une string on utilise []
    //avec le crochet on cherche si planName existe dans planDetail
    // ✅ Crochets - utilise la valeur de la variable pour rechercher planName dans plandetail
    const plan = planDetails[planName as keyof typeof planDetails];
    const planTitle = plan?.title || planName;
    const features = plan?.features || [];

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: user.email,
      subject: `🎉 Bienvenue dans Last - ${planTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🎉 Bienvenue chez Last !
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Votre abonnement ${planTitle} est actif
            </p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Bonjour ${user.name} ! 👋
            </h2>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Merci d'avoir rejoint notre communauté ! Votre profil est maintenant <strong>visible</strong> et vous pouvez profiter de toutes les fonctionnalités de votre plan.
            </p>

            <!-- Plan Features -->
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                ✨ Ce que vous débloquez :
              </h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569;">
                ${features.map((feature) => `<li style="margin: 8px 0;">${feature}</li>`).join('')}
              </ul>
            </div>

            <!-- Next Steps -->
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600;">📝 Prochaines étapes :</p>
              <ol style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li style="margin: 8px 0;">Complétez votre profil avec vos plus belles photos</li>
                <li style="margin: 8px 0;">Ajoutez une description captivante</li>
                <li style="margin: 8px 0;">Commencez à explorer les profils</li>
              </ol>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.BETTER_AUTH_URL}/profile" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                🚀 Compléter mon profil
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Besoin d'aide ? Notre équipe est là pour vous accompagner.
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              Cordialement,<br>
              <strong style="color: #1e293b;">L'équipe Last</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email de bienvenue envoyé avec succès à:', user.email);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    throw error;
  }
};

// Fonction pour envoyer un email d'annulation d'abonnement
export const sendCancellationEmail = async (referenceId: string) => {
  try {
    // Récupérer l'utilisateur depuis la BDD
    const user = await prisma.user.findUnique({
      where: { id: referenceId },
      select: { email: true, name: true },
    });

    if (!user) {
      console.error('User not found for referenceId:', referenceId);
      return;
    }

    const result = await resend.emails.send({
      from: 'boilerplate@lakka.blue',
      to: user.email,
      subject: "Confirmation d'annulation - Last",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              Abonnement annulé
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Nous confirmons l'annulation de votre abonnement
            </p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
              Bonjour ${user.name} 👋
            </h2>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Nous avons bien pris en compte votre demande d'annulation. Votre abonnement restera actif jusqu'à la fin de votre période de facturation en cours.
            </p>

            <!-- Info Box -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 16px; line-height: 1.6;">
                ⚠️ <strong>Important :</strong> Vous continuerez à avoir accès à toutes vos fonctionnalités premium jusqu'à la fin de votre période payée.
              </p>
            </div>

            <!-- Feedback -->
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600;">💭 Vous nous manquerez !</p>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                Nous aimerions savoir pourquoi vous nous quittez pour améliorer notre service. N'hésitez pas à nous faire part de vos remarques.
              </p>
            </div>

            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Vous pouvez réactiver votre abonnement à tout moment depuis votre profil. Nous serions ravis de vous revoir !
            </p>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.BETTER_AUTH_URL}/pricing" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); margin: 5px;">
                🔄 Réactiver mon abonnement
              </a>
              <a href="${process.env.BETTER_AUTH_URL}/contact" style="display: inline-block; background: white; color: #3b82f6; border: 2px solid #3b82f6; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 5px;">
                💬 Donnez votre avis
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              Merci d'avoir fait partie de notre communauté !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              Cordialement,<br>
              <strong style="color: #1e293b;">L'équipe Last</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email d'annulation envoyé avec succès à:", user.email);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email d'annulation:", error);
    throw error;
  }
};
