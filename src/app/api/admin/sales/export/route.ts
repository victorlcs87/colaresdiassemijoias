import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
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

function parseDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatDateBR(value: string | null) {
    if (!value) return "Não informado";
    return parseDate(value).toLocaleDateString("pt-BR");
}

function toNumber(value: number | null | undefined) {
    return Number((value || 0).toFixed(2));
}

function buildProductAnalysis(sales: SaleRow[]) {
    const grouped = new Map<
        string,
        { produto: string; cor: string; quantidade: number; receita: number; custo: number; lucro: number }
    >();

    for (const sale of sales) {
        const cor = sale.product_color || "Sem cor";
        const key = `${sale.product_name}::${cor}`;
        const receita = sale.sale_price || 0;
        const custo = sale.cost_price || 0;
        const lucro = receita - custo;
        const current = grouped.get(key);

        if (current) {
            current.quantidade += 1;
            current.receita += receita;
            current.custo += custo;
            current.lucro += lucro;
            continue;
        }

        grouped.set(key, {
            produto: sale.product_name,
            cor,
            quantidade: 1,
            receita,
            custo,
            lucro,
        });
    }

    return Array.from(grouped.values())
        .map((row) => ({
            ...row,
            margem: row.receita > 0 ? row.lucro / row.receita : 0,
        }))
        .sort((a, b) => b.lucro - a.lucro);
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

    const typedSales = ((sales || []) as SaleRow[]).map((sale) => ({
        ...sale,
        cost_price: sale.cost_price ?? 0,
    }));
    const totalRevenue = typedSales.reduce((sum, sale) => sum + sale.sale_price, 0);
    const totalCost = typedSales.reduce((sum, sale) => sum + (sale.cost_price || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;
    const averageTicket = typedSales.length > 0 ? totalRevenue / typedSales.length : 0;
    const productAnalysis = buildProductAnalysis(typedSales);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Colares Dias Semijoias";
    workbook.created = new Date();
    workbook.modified = new Date();

    const brandPrimary = "8B2E1F";
    const brandDark = "2A120D";
    const brandAccent = "D9B7A6";
    const white = "FFFFFF";

    const summarySheet = workbook.addWorksheet("Resumo Executivo", {
        views: [{ state: "frozen", xSplit: 0, ySplit: 5, showGridLines: false }],
    });
    summarySheet.columns = [
        { width: 4 },
        { width: 22 },
        { width: 22 },
        { width: 22 },
        { width: 22 },
        { width: 22 },
        { width: 22 },
        { width: 22 },
    ];

    summarySheet.mergeCells("B1:H1");
    summarySheet.getCell("B1").value = "RELATÓRIO EXECUTIVO DE VENDAS";
    summarySheet.getCell("B1").font = { name: "Calibri", size: 20, bold: true, color: { argb: white } };
    summarySheet.getCell("B1").alignment = { vertical: "middle", horizontal: "left" };
    summarySheet.getCell("B1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandPrimary } };
    summarySheet.getRow(1).height = 34;

    summarySheet.mergeCells("B2:H2");
    summarySheet.getCell("B2").value = "Colares Dias Semijoias";
    summarySheet.getCell("B2").font = { name: "Calibri", size: 12, bold: true, color: { argb: white } };
    summarySheet.getCell("B2").alignment = { vertical: "middle", horizontal: "left" };
    summarySheet.getCell("B2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandDark } };
    summarySheet.getRow(2).height = 24;

    summarySheet.mergeCells("B4:H4");
    summarySheet.getCell("B4").value = `Período: ${formatDateBR(startDate)} até ${formatDateBR(endDate)} • Gerado em ${new Date().toLocaleString("pt-BR")}`;
    summarySheet.getCell("B4").font = { name: "Calibri", size: 10, italic: true, color: { argb: "4A5568" } };
    summarySheet.getCell("B4").alignment = { vertical: "middle", horizontal: "left" };

    const kpis = [
        { title: "Total de Vendas", value: typedSales.length, type: "number" as const },
        { title: "Receita Total", value: totalRevenue, type: "currency" as const },
        { title: "Custo Total", value: totalCost, type: "currency" as const },
        { title: "Lucro Total", value: totalProfit, type: "currency" as const },
    ];

    let colStart = 2;
    for (const [index, kpi] of kpis.entries()) {
        const titleCell = summarySheet.getCell(6, colStart);
        const valueCell = summarySheet.getCell(7, colStart);
        summarySheet.mergeCells(6, colStart, 6, colStart + 1);
        summarySheet.mergeCells(7, colStart, 7, colStart + 1);

        titleCell.value = kpi.title;
        titleCell.font = { bold: true, color: { argb: white }, size: 11 };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandDark } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };

        valueCell.value = kpi.type === "number" ? kpi.value : toNumber(kpi.value);
        valueCell.font = { bold: true, color: { argb: brandPrimary }, size: 14 };
        valueCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F5" } };
        valueCell.alignment = { horizontal: "center", vertical: "middle" };
        if (kpi.type === "currency") {
            valueCell.numFmt = '"R$" #,##0.00';
        }

        for (const row of [6, 7]) {
            for (let c = colStart; c <= colStart + 1; c++) {
                summarySheet.getCell(row, c).border = {
                    top: { style: "thin", color: { argb: brandAccent } },
                    left: { style: "thin", color: { argb: brandAccent } },
                    bottom: { style: "thin", color: { argb: brandAccent } },
                    right: { style: "thin", color: { argb: brandAccent } },
                };
            }
        }

        colStart += 2;
        if (index === 1) colStart += 0;
    }

    summarySheet.getCell("B10").value = "Indicadores Complementares";
    summarySheet.getCell("B10").font = { bold: true, size: 12, color: { argb: brandDark } };
    summarySheet.getCell("B10").alignment = { horizontal: "left", vertical: "middle" };

    const indicators = [
        ["Margem de Lucro", profitMargin],
        ["Ticket Médio", toNumber(averageTicket)],
        ["Produtos Distintos Vendidos", productAnalysis.length],
    ] as const;

    let indicatorRow = 11;
    for (const [label, value] of indicators) {
        summarySheet.getCell(`B${indicatorRow}`).value = label;
        summarySheet.getCell(`B${indicatorRow}`).font = { size: 10, color: { argb: "4A5568" }, bold: true };
        summarySheet.getCell(`C${indicatorRow}`).value = value;
        summarySheet.getCell(`C${indicatorRow}`).font = { size: 11, color: { argb: brandDark }, bold: true };
        if (label === "Margem de Lucro") {
            summarySheet.getCell(`C${indicatorRow}`).numFmt = "0.00%";
        } else if (label === "Ticket Médio") {
            summarySheet.getCell(`C${indicatorRow}`).numFmt = '"R$" #,##0.00';
        }
        indicatorRow += 1;
    }

    summarySheet.getCell("B15").value = "Top 5 produtos por receita";
    summarySheet.getCell("B15").font = { bold: true, size: 12, color: { argb: brandDark } };
    summarySheet.getCell("B16").value = "Produto";
    summarySheet.getCell("C16").value = "Quantidade";
    summarySheet.getCell("D16").value = "Receita";
    summarySheet.getCell("E16").value = "Lucro";

    for (const col of ["B16", "C16", "D16", "E16"]) {
        const cell = summarySheet.getCell(col);
        cell.font = { bold: true, color: { argb: white } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandPrimary } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    }

    const topProducts = [...productAnalysis].sort((a, b) => b.receita - a.receita).slice(0, 5);
    let topRow = 17;
    for (const item of topProducts) {
        summarySheet.getCell(`B${topRow}`).value = `${item.produto} (${item.cor})`;
        summarySheet.getCell(`C${topRow}`).value = item.quantidade;
        summarySheet.getCell(`D${topRow}`).value = toNumber(item.receita);
        summarySheet.getCell(`E${topRow}`).value = toNumber(item.lucro);
        summarySheet.getCell(`D${topRow}`).numFmt = '"R$" #,##0.00';
        summarySheet.getCell(`E${topRow}`).numFmt = '"R$" #,##0.00';
        topRow += 1;
    }

    try {
        const logoPath = path.join(process.cwd(), "public", "brand", "logo-colares-dias.png");
        const logoBuffer = await readFile(logoPath);
        const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
        const imageId = workbook.addImage({ base64: logoBase64, extension: "png" });
        summarySheet.addImage(imageId, {
            tl: { col: 0.2, row: 0.2 },
            ext: { width: 94, height: 94 },
        });
    } catch {
        // Se o logo não estiver disponível no ambiente de execução, segue sem imagem.
    }

    const detailsSheet = workbook.addWorksheet("Vendas Detalhadas", {
        views: [{ state: "frozen", ySplit: 1 }],
    });
    detailsSheet.columns = [
        { header: "Produto", key: "produto", width: 34 },
        { header: "Cor", key: "cor", width: 18 },
        { header: "Data", key: "data", width: 14 },
        { header: "Custo (R$)", key: "custo", width: 16 },
        { header: "Venda (R$)", key: "venda", width: 16 },
        { header: "Lucro (R$)", key: "lucro", width: 16 },
        { header: "Observações", key: "obs", width: 38 },
    ];

    detailsSheet.getRow(1).height = 22;
    detailsSheet.getRow(1).font = { bold: true, color: { argb: white } };
    detailsSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandPrimary } };
    detailsSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    for (const sale of typedSales) {
        const cost = sale.cost_price || 0;
        const profit = sale.sale_price - cost;
        const row = detailsSheet.addRow({
            produto: sale.product_name,
            cor: sale.product_color || "",
            data: parseDate(sale.sale_date),
            custo: toNumber(cost),
            venda: toNumber(sale.sale_price),
            lucro: toNumber(profit),
            obs: sale.notes || "",
        });
        row.getCell("data").numFmt = "dd/mm/yyyy";
        row.getCell("custo").numFmt = '"R$" #,##0.00';
        row.getCell("venda").numFmt = '"R$" #,##0.00';
        row.getCell("lucro").numFmt = '"R$" #,##0.00';
    }

    detailsSheet.autoFilter = "A1:G1";
    detailsSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const isEven = rowNumber % 2 === 0;
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isEven ? "FFF8F5" : "FFFFFFFF" },
        };
        row.alignment = { vertical: "middle" };
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FFE2E8F0" } },
                left: { style: "thin", color: { argb: "FFE2E8F0" } },
                bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
                right: { style: "thin", color: { argb: "FFE2E8F0" } },
            };
        });
    });

    const analysisSheet = workbook.addWorksheet("Análise por Produto", {
        views: [{ state: "frozen", ySplit: 1 }],
    });
    analysisSheet.columns = [
        { header: "Produto", key: "produto", width: 34 },
        { header: "Cor", key: "cor", width: 18 },
        { header: "Quantidade", key: "quantidade", width: 14 },
        { header: "Receita (R$)", key: "receita", width: 16 },
        { header: "Custo (R$)", key: "custo", width: 16 },
        { header: "Lucro (R$)", key: "lucro", width: 16 },
        { header: "Margem", key: "margem", width: 12 },
    ];
    analysisSheet.getRow(1).font = { bold: true, color: { argb: white } };
    analysisSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: brandPrimary } };
    analysisSheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    for (const item of productAnalysis) {
        const row = analysisSheet.addRow({
            produto: item.produto,
            cor: item.cor,
            quantidade: item.quantidade,
            receita: toNumber(item.receita),
            custo: toNumber(item.custo),
            lucro: toNumber(item.lucro),
            margem: item.margem,
        });
        row.getCell("receita").numFmt = '"R$" #,##0.00';
        row.getCell("custo").numFmt = '"R$" #,##0.00';
        row.getCell("lucro").numFmt = '"R$" #,##0.00';
        row.getCell("margem").numFmt = "0.00%";
    }

    if (productAnalysis.length === 0) {
        analysisSheet.addRow({
            produto: "Sem dados no período selecionado.",
            cor: "",
            quantidade: "",
            receita: "",
            custo: "",
            lucro: "",
            margem: "",
        });
    }

    analysisSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const isEven = rowNumber % 2 === 0;
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isEven ? "FFF8F5" : "FFFFFFFF" },
        };
    });

    const fileBuffer = await workbook.xlsx.writeBuffer();
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
