import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                success: false,
                error: 'Variáveis do Supabase não configuradas.',
            }, { status: 503 });
        }

        if (!cronSecret) {
            return NextResponse.json({
                success: false,
                error: 'CRON_SECRET não configurado no ambiente.',
            }, { status: 503 });
        }

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({
                success: false,
                error: 'Não autorizado.',
            }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

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
