import Link from "next/link";
import { Instagram, Facebook, Camera } from "lucide-react";
import { getStoreSettings } from "@/actions/settings";
import { getStoreContactEmail, getStoreInstagram, getStoreWhatsapp } from "@/lib/storeSettings";

export async function Footer() {
    const settings = await getStoreSettings();
    const whatsappNumber = getStoreWhatsapp(settings).replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    const contactEmail = getStoreContactEmail(settings);
    const instagramUser = getStoreInstagram(settings);
    const instagramUrl = `https://www.instagram.com/${instagramUser}`;

    return (
        <footer className="bg-[#f6ede5] dark:bg-[#2a120d] border-t border-[#d9b7a6] dark:border-[#5a3329] mt-auto relative pt-12">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-12">

                    {/* Brand Info */}
                    <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                                    <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Colares Dias Semijoias</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Acessórios e semijoias com curadoria elegante. Escolha suas peças favoritas e finalize seu pedido com atendimento direto pelo WhatsApp.
                        </p>
                        <div className="flex gap-3">
                            <a className="size-9 rounded-full bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm" href={instagramUrl} target="_blank" rel="noreferrer">
                                <Instagram className="size-4" />
                            </a>
                            <a className="size-9 rounded-full bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm" href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                <Facebook className="size-4" />
                            </a>
                            <a className="size-9 rounded-full bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm" href={instagramUrl} target="_blank" rel="noreferrer">
                                <Camera className="size-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Fixos */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Links Rápidos</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/about">Sobre Nós</Link></li>
                            <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/how-to-buy">Como Comprar</Link></li>
                            <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="/catalog">Catálogo</Link></li>
                        </ul>
                    </div>

                    {/* Contato & Suporte */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Contato & Suporte</h4>
                        <div className="flex flex-col gap-4">
                            <a className="group flex items-center gap-3 bg-[#25D366]/10 p-3 rounded-lg border border-[#25D366]/20 hover:bg-[#25D366] transition-all duration-300" href={whatsappUrl}>
                                <div className="bg-[#25D366] text-white p-2 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#25D366] transition-colors">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:text-white/90">Suporte WhatsApp</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-white">{getStoreWhatsapp(settings)}</p>
                                </div>
                            </a>
                            <a className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href={`mailto:${contactEmail}`}>
                                <span className="material-symbols-outlined text-lg">mail</span>
                                {contactEmail}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-[#d9b7a6] dark:border-[#5a3329] py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>© {new Date().getFullYear()} Colares Dias Semijoias. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <Link className="hover:text-primary transition-colors" href="#">Política de Privacidade</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Termos de Uso</Link>
                        <Link className="hover:text-primary transition-colors" href="#">Mapa do Site</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
}
