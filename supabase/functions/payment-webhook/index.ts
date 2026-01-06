import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
if (!RESEND_API_KEY) {
    console.warn("Aviso: RESEND_API_KEY não está configurada");
}
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        console.log("Webhook received:", payload);

        // Kiwify sends 'order_status'
        const status = payload.order_status;
        if (status !== 'paid') {
            return new Response(JSON.stringify({ message: "Ignored: Not paid" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        const email = payload.Customer?.email || payload.customer?.email;
        const productName = payload.Product?.name || "Créditos Alquimia Criativa";
        const txId = payload.order_id || payload.Order?.id;
        const customerName = payload.Customer?.full_name || "Criador";

        // Calculate Credits
        let creditsToAdd = 0;
        const amountInCents = parseInt(payload.commissions?.charge_amount || "0");
        const price = amountInCents / 100;

        if (amountInCents === 1990) creditsToAdd = 250;
        else if (amountInCents === 4990) creditsToAdd = 750;
        else if (amountInCents === 9990) creditsToAdd = 1800;
        else creditsToAdd = 0; // Fallback

        console.log(`Processing payment of R$${price} -> Adding ${creditsToAdd} credits for ${email}`);

        // Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 1. Check if User Exists
        let userId: string | null = null;
        let isNewUser = false;
        let generatedPassword = "";

        const { data: { users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            userId = existingUser.id;
            console.log("User found:", userId);
        } else {
            console.log("User not found. Creating new user...");
            isNewUser = true;
            // Generate Random Password
            generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: generatedPassword,
                email_confirm: true,
                user_metadata: { full_name: customerName }
            });

            if (createError) throw createError;
            userId = newUser.user.id;
        }

        // 2. Add Credits (using RPC)
        const { error: rpcError } = await supabaseAdmin.rpc('add_credits_by_email', {
            user_email: email,
            credit_amount: creditsToAdd,
            tx_id: txId,
            paid_amount: price
        });

        if (rpcError) {
            console.error("RPC Error (Credits might be partially applied or failed):", rpcError);
            // Don't throw here to ensure email still sends if user was created
        }

        // 3. Send Email
        let emailSubject = "";
        let emailHtml = "";

        if (isNewUser) {
            emailSubject = "Bem-vindo à Alquimia Criativa! Seus dados de acesso.";
            emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #333;">
                    <h1 style="color: #ff5f00;">Bem-vindo(a) à Alquimia Criativa! 🧪</h1>
                    <p>Você acabou de adquirir <strong>${creditsToAdd} Créditos</strong>.</p>
                    <p>Como você ainda não tinha cadastro, criamos um para você automaticamente.</p>
                    
                    <div style="background-color: #111; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff5f00;">
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Senha Provisória:</strong> ${generatedPassword}</p>
                    </div>

                    <p>Acesse agora: <a href="https://prompt-forge.vercel.app" style="color: #ff5f00;">https://prompt-forge.vercel.app</a></p>
                    <p style="font-size: 12px; color: #666;">Você pode alterar sua senha nas configurações a qualquer momento.</p>
                </div>
            `;
        } else {
            emailSubject = "Créditos Adicionados! - Alquimia Criativa";
            emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #333;">
                    <h1 style="color: #ff5f00;">Pagamento Confirmado! ⚡</h1>
                    <p>Olá, ${customerName}!</p>
                    <p>Adicionamos <strong>${creditsToAdd} Créditos</strong> à sua conta.</p>
                    <p>Já está pronto para criar!</p>
                    <a href="https://prompt-forge.vercel.app" style="display: inline-block; background-color: #ff5f00; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Acessar Plataforma</a>
                </div>
            `;
        }

        try {
            await resend.emails.send({
                from: 'Alquimia Criativa <onboarding@resend.dev>', // Use default testing domain or user's verified domain
                to: email,
                subject: emailSubject,
                html: emailHtml,
            });
            console.log("Email sent successfully to", email);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        return new Response(JSON.stringify({ success: true, isNewUser }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
