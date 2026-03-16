import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function loadEnvFile() {
    const filename = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
    if (!fs.existsSync(filename)) return;

    const content = fs.readFileSync(filename, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;

        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadEnvFile();

const ADMIN_USER = process.env.login || process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.password || process.env.ADMIN_PASSWORD || "";

function assertEnv() {
    if (!ADMIN_USER || !ADMIN_PASSWORD) {
        throw new Error("Credenciais admin ausentes no ambiente. Configure login/password em .env.local.");
    }
}

async function runStep(name, fn) {
    process.stdout.write(`\n[DOM] ${name}... `);
    await fn();
    console.log("OK");
}

async function safeText(locator) {
    return (await locator.first().textContent())?.trim() || "";
}

async function main() {
    assertEnv();

    const browser = await chromium.launch({ headless: true });
    const uniqueName = `E2E Produto ${Date.now()}`;
    const editedName = `${uniqueName} Editado`;
    let activePage = null;

    try {
        const publicContext = await browser.newContext({
            viewport: { width: 390, height: 844 },
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
            reducedMotion: "reduce",
        });
        const publicPage = await publicContext.newPage();
        activePage = publicPage;

        await runStep("Público: home", async () => {
            const response = await publicPage.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
            if (!response || response.status() !== 200) {
                throw new Error(`Home retornou status inválido: ${response?.status()}`);
            }
            await publicPage.locator("header").first().waitFor();
        });

        await runStep("Público: catálogo -> detalhe", async () => {
            await publicPage.goto(`${BASE_URL}/catalog`, { waitUntil: "domcontentloaded" });
            const firstProductLink = publicPage.locator('article a[href^="/catalog/"]').first();
            await firstProductLink.waitFor({ state: "visible" });
            await firstProductLink.click();
            await publicPage.locator("h1").first().waitFor();
        });

        await runStep("Público: carrinho", async () => {
            await publicPage.goto(`${BASE_URL}/catalog`, { waitUntil: "domcontentloaded" });
            await publicPage.locator("button[aria-label='Alternar tema']:visible").first().waitFor({ state: "visible", timeout: 10000 });
            await publicPage.getByRole("button", { name: /adicionar .* ao carrinho/i }).first().click();
            const cartButton = publicPage.locator("button[aria-label='Abrir carrinho']:visible").first();
            await cartButton.waitFor({ state: "visible", timeout: 10000 });
            await cartButton.click();
            await publicPage.getByRole("heading", { name: /seu carrinho/i }).first().waitFor();
            await publicPage.locator("text=Subtotal").first().waitFor();
            await publicPage.keyboard.press("Escape");
        });

        await runStep("Público: CTA WhatsApp no detalhe", async () => {
            await publicPage.goto(`${BASE_URL}/catalog`, { waitUntil: "domcontentloaded" });
            const firstProductLink = publicPage.locator('article a[href^="/catalog/"]').first();
            await firstProductLink.click();
            await publicPage.locator("h1").first().waitFor();

            const whatsappCta = publicPage.getByRole("link", { name: /whatsapp/i }).first();
            const popupPromise = publicPage.waitForEvent("popup");
            await whatsappCta.click();
            const popup = await popupPromise;
            const popupUrl = popup.url();
            if (!popupUrl.includes("wa.me") && !popupUrl.includes("api.whatsapp.com")) {
                throw new Error(`Popup de checkout inválido: ${popupUrl}`);
            }
            await popup.close();
        });

        await publicContext.close();

        const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await adminContext.newPage();
        activePage = page;

        await runStep("Admin: login inválido", async () => {
            await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
            await page.fill("#username", ADMIN_USER);
            await page.fill("#password", `${ADMIN_PASSWORD}-errada`);
            await page.getByRole("button", { name: /entrar no painel/i }).click();
            await page.getByRole("button", { name: /entrar no painel/i }).waitFor({ state: "visible", timeout: 15000 });
            const errorText = await safeText(page.getByRole("alert"));
            const bodyText = (await page.textContent("body")) || "";
            const hasErrorSignal = /inválid|credencia|usuário|senha|permissão/i.test(`${errorText} ${bodyText}`);
            if (page.url().includes("/admin/dashboard") || !hasErrorSignal) {
                throw new Error(`Mensagem inesperada de erro no login inválido: "${errorText}"`);
            }
        });

        await runStep("Admin: login válido", async () => {
            await page.fill("#username", ADMIN_USER);
            await page.fill("#password", ADMIN_PASSWORD);
            await page.getByRole("button", { name: /entrar no painel/i }).click();
            await page.getByText(/bem-vinda ao painel/i).waitFor({ timeout: 20000 });
        });

        await runStep("Admin: criar produto", async () => {
            await page.goto(`${BASE_URL}/admin/products/new`, { waitUntil: "domcontentloaded" });
            await page.waitForTimeout(1500);
            await page.fill('input[name="name"]', uniqueName);
            await page.fill('textarea[name="description"]', "Produto temporário para validação E2E.");
            await page.fill('input[name="price"]', "129.90");
            await page.fill('input[name="stock_quantity"]', "5");
            await page.getByRole("button", { name: /salvar produto/i }).click();
            await page.waitForURL("**/admin/products", { timeout: 20000 });
            await page.locator('a[href^="/admin/products/edit/"]', { hasText: uniqueName }).first().waitFor();
        });

        await runStep("Admin: editar produto", async () => {
            await page.locator('a[href^="/admin/products/edit/"]', { hasText: uniqueName }).first().click();
            await page.waitForURL("**/admin/products/edit/**");
            await page.waitForTimeout(1200);
            await page.fill('input[name="name"]', editedName);
            await page.getByRole("button", { name: /salvar alterações/i }).click();
            await page.waitForURL("**/admin/products", { timeout: 20000 });
            await page.locator('a[href^="/admin/products/edit/"]', { hasText: editedName }).first().waitFor();
        });

        await runStep("Admin: duplicar produto", async () => {
            await page.getByRole("button", { name: `Duplicar ${editedName}` }).first().click();
            await page.getByRole("button", { name: /^Duplicar$/ }).click();
            await page.getByRole("status").filter({ hasText: /produto duplicado com sucesso/i }).waitFor();
        });

        await runStep("Admin: registrar venda", async () => {
            const productRow = page.locator("tr", { hasText: editedName }).first();
            await productRow.getByTitle("Registrar Venda").click();
            await page.getByRole("dialog", { name: /registrar venda/i }).waitFor();
            const priceInput = page.locator('input[type="number"]').first();
            const currentPrice = await priceInput.inputValue();
            if (!currentPrice) {
                await priceInput.fill("129.90");
            }
            await page.getByRole("button", { name: /confirmar venda/i }).click();
            await page.getByRole("status").filter({ hasText: /venda registrada com sucesso/i }).waitFor();
        });

        await runStep("Admin: desfazer venda", async () => {
            await page.goto(`${BASE_URL}/admin/sales`, { waitUntil: "domcontentloaded" });
            await page.locator("tr", { hasText: editedName }).first().waitFor();
            await page.locator("tr", { hasText: editedName }).first().getByTitle("Desfazer Venda").click();
            await page.getByRole("dialog").getByRole("button", { name: /^Desfazer venda$/i }).click();
            await page.getByRole("status").filter({ hasText: /venda desfeita com sucesso/i }).waitFor();
        });

        await runStep("Admin: salvar configurações", async () => {
            await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: "domcontentloaded" });
            await page.getByRole("heading", { name: /configurações/i }).waitFor();
            await page.getByRole("button", { name: /salvar alterações/i }).click();
            await page.locator("text=Configurações salvas no banco de dados!").waitFor();
        });

        await runStep("Admin: excluir produtos de teste", async () => {
            await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "domcontentloaded" });
            for (let i = 0; i < 5; i += 1) {
                const row = page.locator("tr", { hasText: editedName }).first();
                if ((await row.count()) === 0) break;
                await row.getByRole("button", { name: `Excluir ${editedName}` }).click();
                await page.getByRole("button", { name: /^Excluir$/ }).click();
                await page.waitForTimeout(500);
            }
        });

        await adminContext.close();

        console.log("\n[DOM] Suíte completa executada com sucesso.");
    } catch (error) {
        console.error(`\n[DOM] Falha: ${error instanceof Error ? error.message : String(error)}`);
        if (activePage) {
            await activePage.screenshot({ path: "dom-e2e-failure.png", fullPage: true });
        }
        throw error;
    } finally {
        await browser.close();
    }
}

main().catch(() => process.exit(1));
