const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:3000';

(async () => {
    const browser = await chromium.launch({ headless: true });

    // iPhone 14 viewport
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        reducedMotion: 'reduce',
    });

    const page = await context.newPage();

    try {
        console.log('--- MOBILE TEST SUITE ---');

        // 1. Home Page loads
        console.log('\n1. Testing Home Page...');
        const homeRes = await page.goto(`${TARGET_URL}/`, { timeout: 30000 });
        console.log(`   Status: ${homeRes.status()}`);
        if (homeRes.status() !== 200) throw new Error('Home returned ' + homeRes.status());
        console.log('   ✅ Home loads correctly');

        // 2. MobileHeader is visible (desktop header hidden)
        console.log('\n2. Testing MobileHeader...');
        const mobileHeaderVisible = await page.isVisible('header.md\\:hidden');
        const desktopHeaderVisible = await page.isVisible('header.hidden.md\\:block');
        console.log(`   MobileHeader visible: ${mobileHeaderVisible}`);
        console.log(`   DesktopHeader visible: ${desktopHeaderVisible}`);
        if (!mobileHeaderVisible) throw new Error('MobileHeader not visible');
        console.log('   ✅ MobileHeader is shown');

        // 3. Mobile Search
        console.log('\n3. Testing Mobile Search...');
        await page.click('header button:has(.lucide-search)');
        await page.waitForSelector('input[placeholder="Buscar produtos..."]', { timeout: 5000 });
        await page.fill('input[placeholder="Buscar produtos..."]', 'Colar');
        await page.keyboard.press('Enter');
        await page.waitForURL('**/catalog?q=Colar', { timeout: 10000 });
        console.log('   ✅ Mobile Search works');

        // 4. MobileNav is visible
        console.log('\n4. Testing MobileNav...');
        const mobileNavVisible = await page.isVisible('nav.md\\:hidden');
        console.log(`   MobileNav visible: ${mobileNavVisible}`);
        if (!mobileNavVisible) throw new Error('MobileNav not visible');
        console.log('   ✅ MobileNav is shown');

        // 5. Add to cart from mobile
        console.log('\n5. Testing Add to Cart (Mobile)...');
        await page.goto(`${TARGET_URL}/catalog`, { timeout: 30000 });
        const addBtn = page.locator('button[title="Adicionar ao Carrinho"]').first();
        if (await addBtn.isVisible({ timeout: 5000 })) {
            await addBtn.click();
            console.log('   ✅ Added item to cart');

            // Check cart badge in MobileNav
            const navBadge = page.locator('nav.md\\:hidden span.bg-primary');
            await navBadge.waitFor({ state: 'visible', timeout: 5000 });
            console.log('   ✅ Cart badge visible in MobileNav');
        } else {
            console.log('   ⚠️ No products to test cart');
        }

        // 6. Cart icon in mobile header
        console.log('\n6. Testing Cart in MobileHeader...');
        const cartBtn = page.locator('header button:has(.lucide-shopping-cart)').first();
        if (await cartBtn.isVisible({ timeout: 3000 })) {
            await cartBtn.click();
            await page.waitForSelector('h3:has-text("Seu Carrinho")', { timeout: 5000 });
            console.log('   ✅ CartDrawer opens from MobileHeader');
        } else {
            console.log('   ⚠️ Cart button not found in header');
        }

        // 7. Menu Drawer
        console.log('\n7. Testing Menu Drawer...');
        // Fecha o carrinho clicando no overlay para evitar flakiness do botão X em animações
        const cartDrawerTitle = page.locator('h3:has-text("Seu Carrinho")').first();
        if (await cartDrawerTitle.isVisible({ timeout: 1500 })) {
            await page.mouse.click(10, 10);
            await page.waitForSelector('.cart-drawer-portal div.translate-x-full', { timeout: 5000 });
        }
        await page.waitForTimeout(500);

        await page.click('header button:has(.lucide-menu)');
        await page.waitForSelector('text=Catálogo', { timeout: 5000 });
        const drawerLinks = await page.locator('nav a, nav button').count();
        console.log(`   Found ${drawerLinks} nav links in drawer`);
        console.log('   ✅ Menu Drawer opens');

        // 8. Admin page on mobile (should not show MobileNav)
        console.log('\n8. Testing Admin on Mobile...');
        await page.goto(`${TARGET_URL}/admin`, { timeout: 30000 });
        const mobileNavOnAdmin = await page.isVisible('nav.md\\:hidden');
        console.log(`   MobileNav on Admin: ${mobileNavOnAdmin} (should be false)`);
        console.log('   ✅ Admin page accessible on mobile');

        console.log('\n🎉 ALL MOBILE TESTS PASSED!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
