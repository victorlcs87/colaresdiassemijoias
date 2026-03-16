import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/server";

interface SaleRow {
    product_name: string;
    product_color: string | null;
    cost_price: number | null;
    sale_price: number;
    sale_date: string;
    notes: string | null;
}

function isValidDateFilter(value: string | null) {
    if (!value) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
    const startDate = request.nextUrl.searchParams.get("startDate");
    const endDate = request.nextUrl.searchParams.get("endDate");

    if (!isValidDateFilter(startDate) || !isValidDateFilter(endDate)) {
        return NextResponse.json({ error: "Filtro de data inválido." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
        .from("admin_profiles")
        .select("username")
        .eq("email", user.email)
        .maybeSingle();

    if (!adminProfile) {
        return NextResponse.json({ error: "Sem permissão para exportar relatório." }, { status: 403 });
    }

    let query = supabase
        .from("sales")
        .select("product_name,product_color,cost_price,sale_price,sale_date,notes")
        .order("sale_date", { ascending: false });

    if (startDate) {
        query = query.gte("sale_date", startDate);
    }

    if (endDate) {
        query = query.lte("sale_date", endDate);
    }

    const { data: sales, error } = await query;

    if (error) {
        return NextResponse.json({ error: "Erro ao buscar dados para exportação." }, { status: 500 });
    }

    const typedSales = (sales || []) as SaleRow[];
    const totalRevenue = typedSales.reduce((sum, sale) => sum + (sale.sale_price || 0), 0);
    const totalCost = typedSales.reduce((sum, sale) => sum + (sale.cost_price || 0), 0);
    const totalProfit = totalRevenue - totalCost;

    const workbook = XLSX.utils.book_new();

    const summaryData = [
        ["Relatório de Vendas - Colares Dias Semijoias"],
        [],
        ["Data início", startDate || "Não informada"],
        ["Data fim", endDate || "Não informada"],
        ["Total de vendas", typedSales.length],
        ["Receita total", Number(totalRevenue.toFixed(2))],
        ["Custo total", Number(totalCost.toFixed(2))],
        ["Lucro total", Number(totalProfit.toFixed(2))],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumo");

    const salesSheet = XLSX.utils.json_to_sheet(
        typedSales.map((sale) => ({
            Produto: sale.product_name,
            Cor: sale.product_color || "",
            Custo: sale.cost_price ?? "",
            "Preço de Venda": sale.sale_price,
            Lucro: sale.cost_price != null ? Number((sale.sale_price - sale.cost_price).toFixed(2)) : "",
            Data: sale.sale_date,
            Observações: sale.notes || "",
        }))
    );
    XLSX.utils.book_append_sheet(workbook, salesSheet, "Vendas");

    const fileBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `relatorio-vendas-${startDate || "inicio"}_a_${endDate || "fim"}.xlsx`;

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}
