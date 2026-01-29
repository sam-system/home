/**
 * Cloudflare Function pour traiter le formulaire de contact
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
        
        // Construction de l'email
        const emailContent = `
Nouveau message de contact S@mSystem
=====================================

Nom: ${nom}
Prénom: ${prenom}
Téléphone: ${tel}
Email: ${email}
Sujet: ${sujet}
Type: ${type}

Message:
${message}

=====================================
Envoyé depuis le formulaire de contact S@mSystem
        `.trim();
        
        // Envoi de l'email via MailChannels (intégré gratuitement avec Cloudflare Workers)
        const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: 'samsystem.contact@gmail.com', name: 'S@mSystem' }],
                        dkim_domain: 'sam-system.github.io',
                        dkim_selector: 'mailchannels',
                    }
                ],
                from: {
                    email: 'noreply@sam-system.github.io',
                    name: 'Formulaire S@mSystem'
                },
                reply_to: {
                    email: email,
                    name: `${prenom} ${nom}`
                },
                subject: `[S@mSystem] ${sujet}`,
                content: [
                    {
                        type: 'text/plain',
                        value: emailContent
                    }
                ]
            })
        });
        
        if (!emailResponse.ok) {
            console.error('Erreur MailChannels:', await emailResponse.text());
            return new Response(JSON.stringify({
                success: false,
                message: 'Erreur lors de l\'envoi de l\'email.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Succès
        return new Response(JSON.stringify({
            success: true,
            message: 'Message envoyé avec succès !'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
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
