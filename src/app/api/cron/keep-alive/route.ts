import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o supabase admin bypass para bater direto no node
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Podemos usar a anon pro ping
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // Opcional: Proteger a rota para que apenas o Vercel Cron acesse
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // Se configurarmos CRON_SECRET no Vercel no futuro, temos segurança.
            // Mas no caso mínimo, apenas queremos "acordar" o banco.
        }

        // Ping simples na tabela de produtos
        const { data, error } = await supabase.from('products').select('id').limit(1);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Supabase ping executado com sucesso.',
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message || 'Falha ao pingar Supabase'
        }, { status: 500 });
    }
}
