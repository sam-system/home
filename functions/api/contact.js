/**
 * Cloudflare Function pour traiter le formulaire de contact
 * Utilise Resend (3000 emails/mois gratuit)
 * Ce fichier doit être placé dans : functions/api/contact.js
 */

export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        // Récupération des données du formulaire
        const nom = formData.get('Nom');
        const prenom = formData.get('Prenom');
        const tel = formData.get('Tel');
        const email = formData.get('email');
        const sujet = formData.get('Sujet');
        const type = formData.get('Type');
        const message = formData.get('Message');
        
        // Validation basique
        if (!nom || !prenom || !tel || !email || !sujet || !type || !message) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Tous les champs sont requis.'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Récupération de la clé API depuis les variables d'environnement
        const RESEND_API_KEY = context.env.RESEND_API_KEY;
        
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY non configurée');
            return new Response(JSON.stringify({
                success: false,
                message: 'Configuration serveur manquante.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Construction de l'email HTML
        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #2563eb; }
                .value { margin-top: 5px; }
                .footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin: 0;">📧 Nouveau message - S@mSystem</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">👤 Nom complet :</div>
                        <div class="value">${prenom} ${nom}</div>
                    </div>
                    <div class="field">
                        <div class="label">📞 Téléphone :</div>
                        <div class="value">${tel}</div>
                    </div>
                    <div class="field">
                        <div class="label">📧 Email :</div>
                        <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    <div class="field">
                        <div class="label">🏢 Type :</div>
                        <div class="value">${type}</div>
                    </div>
                    <div class="field">
                        <div class="label">📋 Sujet :</div>
                        <div class="value">${sujet}</div>
                    </div>
                    <div class="field">
                        <div class="label">💬 Message :</div>
                        <div class="value" style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">${message}</div>
                    </div>
                </div>
                <div class="footer">
                    S@mSystem : L'informatique au bout du fil
                </div>
            </div>
        </body>
        </html>
        `;
        
        // Envoi via Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'S@mSystem <onboarding@resend.dev>', // Email par défaut de Resend
                to: ['samsystem.contact@gmail.com'],
                reply_to: email,
                subject: `[S@mSystem] ${sujet}`,
                html: emailHTML
            })
        });
        
        const resendResult = await resendResponse.json();
        
        if (resendResponse.ok) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Message envoyé avec succès !'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            console.error('Erreur Resend:', resendResult);
            return new Response(JSON.stringify({
                success: false,
                message: 'Erreur lors de l\'envoi de l\'email.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Erreur serveur.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
