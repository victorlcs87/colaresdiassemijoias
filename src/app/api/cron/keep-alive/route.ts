import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                success: false,
                error: 'Variáveis do Supabase não configuradas.',
            }, { status: 503 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Opcional: Proteger a rota para que apenas o Vercel Cron acesse
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Se configurarmos CRON_SECRET no Vercel no futuro, temos segurança.
            // Mas no caso mínimo, apenas queremos "acordar" o banco.
        }

        // Ping simples na tabela de produtos
        const { error } = await supabase.from('products').select('id').limit(1);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Supabase ping executado com sucesso.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao pingar Supabase';
        return NextResponse.json({
            success: false,
            error: message
        }, { status: 500 });
    }
}
