import { Palette, Database, Shield, History, Target, ShieldCheck, Sparkles, LayoutDashboard, Zap, ArrowRight, CreditCard, Smartphone } from 'lucide-react'

const DesktopChangelogTab = () => {
  return (
                  <div className="space-y-6">
                    <div className="relative card bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[2rem] shadow-sm overflow-hidden">
                      {/* Acento superior de cor */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600" />
                      
                      <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-neutral-850">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-display">
                              <History className="w-5 h-5 text-purple-500 animate-spin-reverse" />
                              Registro de Mudanças
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 italic">
                              "Evoluindo constantemente para o seu sucesso financeiro"
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold ring-1 ring-primary-200 dark:ring-primary-800">
                              v2.12.33
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Estável</span>
                          </div>
                        </div>

                        <div className="space-y-12">
                          {/* v2.12.33 - ATUAL */}
                          <div className="relative pl-10 border-l-2 border-primary-500 dark:border-primary-600">
                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                            <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.12.33</span>
                                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-[10px] font-bold uppercase tracking-wider">Atual</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                                12 de Maio de 2026
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                    Busca Universal de Ícones
                                  </h4>
                                  <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Integração com Iconify API para busca de milhares de ícones genéricos por palavra-chave.</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Nova barra de busca unificada e indicadores de carregamento em tempo real.</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* v2.9.1 */}
                          <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                            <div className="bg-gray-50/50 dark:bg-neutral-800/30 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.9.1</span>
                              </div>
                              <p className="text-xs text-gray-400 dark:text-neutral-500 mb-6">
                                07 de Maio de 2026
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                    Centralização e UX
                                  </h4>
                                  <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Centralização absoluta das páginas de autenticação (Esqueci Senha, Redefinição e Verificação).</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Correção do componente PageTransition para suportar e aplicar classes de layout (Flexbox).</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* v2.9.0 */}
                          <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                            <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.9.0</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                                07 de Maio de 2026
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                    Estabilidade e Design
                                  </h4>
                                  <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Refinamento do efeito glass na navegação mobile e rodapé branco (branding).</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                      <span>Remoção completa de framer-motion nas páginas de autenticação para maior leveza.</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* v2.8.4 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.8.4</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Glassmorphism Ultra-Refinado
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Efeito glass levado ao extremo com 40% de opacidade e blur ultra-fino (2xl).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.8.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.8.3</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Refinamento Visual
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Efeito glass aprimorado e correção de ícones no changelog.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.8.2 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.8.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Ajustes Landing Page
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Correção de responsividade na Landing Page para dispositivos móveis.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.8.1 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.8.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Refinamento MobileNavBar
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Barra de navegação inferior estilo "Pill" com backdrop-blur.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.8.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.8.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Mobile-First UI Refinement
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Design de "White Card" em tela cheia para mobile em todas as páginas de autenticação.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.9 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.9</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary-600 bg-primary-50 dark:bg-primary-900/30 p-1 rounded" />
                                Transições Dinâmicas
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Implementação de animações de entrada e saída (Fade & Slide) entre páginas.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Integração com AnimatePresence para navegação mais fluida e orgânica.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-emerald-500 dark:border-emerald-600">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.8</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Linting & Cleanup
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Remoção de imports não utilizados em Privacy.tsx (AlertCircle).</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Limpeza de código em páginas institucionais para melhor performance.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>


                      {/* v2.7.7 - ATUAL */}
                      <div className="relative pl-10 border-l-2 border-primary-500 dark:border-primary-600">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.7</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Hotfix Build
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Correção de erro de sintaxe JSX na página Sobre que impedia o build na Vercel.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Mobile UI (Audit)
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Otimização de padding/margens em todas as páginas de fluxo de Autenticação.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.6 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.6</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Otimização Mobile
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Ajuste de padding e margens para telas pequenas em todas as páginas de Autenticação.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Redução de fontes e elementos visuais em dispositivos móveis para melhor usabilidade.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.5 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.5</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Ajustes de UI & UX
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Correção de layout nas páginas Sobre, Termos, Privacidade e Suporte (botão Voltar).</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Melhoria na hierarquia visual dos cabeçalhos das páginas auxiliares.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.4 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.4</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Padronização Visual Global
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Finalização da padronização estética em todas as páginas institucionais e de autenticação.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Otimização de performance com a remoção total de Framer Motion nas páginas auxiliares.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.3</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Padronização Visual Final
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Padronização das páginas: Verificação de Email e Redefinição de Senha.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Consolidação do design system estático e profissional em todos os fluxos de autenticação.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.2 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Padronização Visual (Extras)
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Padronização das páginas: Sobre e Suporte.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.7.1 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Padronização Visual (Auth)
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Padronização das páginas: Cadastro, Esqueci Senha, Privacidade e Termos.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Remoção completa de framer-motion e animações pesadas.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>


                      {/* v2.7.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.7.0</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Histórico</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            07 de Maio de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Limpeza Visual & Performance
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Remoção de framer-motion e animações pesadas da página de login para maior fluidez.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Simplificação do design para um visual sólido, limpo e profissional.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Database className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Correções de Ambiente
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Correção do erro de inicialização do backend local (Supabase Credentials).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.9 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.9</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Histórico</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 p-1 rounded" />
                                Gestão Stripe Pro
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                  <span>Integração do botão "Cancelar" com a API da Stripe.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.8 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-80">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.8</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Histórico</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500 bg-amber-50 dark:bg-amber-900/30 p-1 rounded" />
                                Estética Premium Restaurada
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Restauração total do design vibrante e profissional da página de planos (Plans.tsx).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.7 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800 opacity-70">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.7</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Histórico</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-600 bg-amber-50 dark:bg-amber-900/30 p-1 rounded" />
                                Automação Stripe Webhooks (Fase 4)
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Implementação de endpoint seguro para recebimento de eventos do Stripe.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Ativação instantânea do status Premium após confirmação do checkout com ID do usuário.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.6 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.6</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Infraestrutura Pro & Plano Anual
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Adição do Plano Anual (R$ 149,99/ano) com links de checkout dinâmicos.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Estabilização estrutural do layout de Configurações e correção de aninhamento JSX.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.5 */}
                      <div className="relative pl-10 border-l-2 border-primary-500 dark:border-primary-600">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="bg-primary-50/30 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.5</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Histórico</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Infraestrutura de Pagamentos Real
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                  <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                    <span>Implementação do Link de Pagamento oficial do Stripe no Plano Pro (R$ 14,99/mês) <ArrowRight className="inline-block w-4 h-4 ml-1" /></span>
                                  </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Otimização técnica da logo do produto (Padding & Escala) para exibição profissional no Checkout.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500 bg-amber-50 dark:bg-amber-900/30 p-1 rounded" />
                                Experiência de Checkout
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Configuração de redirecionamento direto para o Stripe em ambiente de produção.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Integração de metadados para tracking de conversão e assinaturas recorrentes.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.4 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.4</span>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Estabilidade de UI & Tipagem Avançada
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Correção de importações ausentes em ícones globais (Lucide) no layout Desktop.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Refatoração de Variantes de Animação (Framer-motion) com tipagem explícita na página de Planos, prevenindo quebras em ambiente de desenvolvimento interativo.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.3</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-blue-500 bg-blue-50 dark:bg-blue-900/30 p-1 rounded" />
                                Modern SaaS Desktop Configuration Layout
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                  <span>Remoção final do layout dual-sidebar focado em mobile na tela de configurações para Desktop.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                  <span>Implementação de Navegação "Horizontal Top Tabs" no Desktop (estilo Modern SaaS), otimizando o aproveitamento da tela padrão, enquanto mantém a navegação grid-card para usuários de smartphone.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.2 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Desktop UI & Layout Architecture
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span>Refatoração estrutural da tela de Configurações para displays Desktop/Laptops. A navegação foi transformada num Sidebar com layout dinâmico responsivo, abandonando o molde exclusivo mobile-first (bento view).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.1 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500 bg-amber-50 dark:bg-amber-900/30 p-1 rounded" />
                                UI Architecture & Premium Plans
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                  <span>Refatoração completa da tela de Assinaturas (Plans), aplicando um modelo de "Brutalismo Tipográfico" e "Tensão Assimétrica", removendo clichês de UI e reforçando a geometria premium.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.6.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.6.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            30 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Cadastro & Autenticação Segura
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Inserida a documentação CPF obrigatória no Formulário de Abertura de Contas, validando formatações no Client e no Servidor e gravando perfeitamente a Tabela na estrutura do Banco de Dados via MCP Supabase.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.5.4 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.5.4</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            23 de Março de 2026 (Hotfix)
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Correção de Fuso Horário
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Alinhamento completo da lógica de fuso horário em criações de transações Recorrentes e Normais (Timezone Date Offset), acabando com as datas lançando em +2 dias após criação.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.5.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.5.3</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            23 de Março de 2026 (Hotfix)
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Integração de Notificações
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Ajustado erro de execução global em `smartNotification.service` ao interpretar nomes de colunas do mapeamento do banco nas análises dinâmicas financeiras.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.5.2 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.5.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            23 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Correções de Segurança e Concorrência
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>Transações Recorrentes:</strong> Implementado sistema de Row-level Lock Pessimista (`FOR UPDATE`) no servidor para evitar duplicação de despesas via Cron Jobs rodando simultaneamente em múltiplos servidores.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>Concorrência de Orçamento:</strong> Resolvida a vulnerabilidade de <em>Race Condition (TOCTOU)</em> ao salvar ou atualizar orçamentos na mesma fração de segundo, migradas para queries de Upsert atômico.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>Edição de Recorrentes:</strong> Resolvidas perdas de dados (Lost Update) quando múltiplos usuários (ou requisições duplicadas em abas do navegador) alteravam descrições/datas de transações em massa ao mesmo tempo.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.5.1 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.5.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            12 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Layout Desktop
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Largura otimizada para monitores grandes e escala de ícones aprimorada.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.5.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.5.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            12 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Nova Interface de Configurações
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Redesign completo estilo mobile/Telegram com lista de ícones e header de perfil.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.4.7 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.4.7</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            11 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Correção de Nitidez
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Removido desfoque indesejado causado por renderização subpixel na GPU.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.4.6 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.4.6</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            11 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <History className="w-5 h-5 text-purple-500 bg-purple-50 dark:bg-purple-900/30 p-1 rounded" />
                                Transições de Página
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                                  <span>Otimização na velocidade das animações entre telas para 0.35s.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.4.4 & 2.4.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.4.4</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            12 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                UX & Portals
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Global Portals:</strong> Seletores e modais agora usam portals para evitar problemas de camada.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Bottom Sheets:</strong> Padrão "Pull-to-close" implementado para modais mobile.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.4.2 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.4.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            11 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Mobile Premium UX
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Recorrências:</strong> ajuste de frequência via CustomSelect com Bottom Sheet nativo em mobile.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Visual:</strong> Suporte a ícones de Emoji para todas as frequências de transação.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Responsividade
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>Relatórios:</strong> Gráficos de pizza redimensionados para telas menores (iPhone SE, etc).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.4.1 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.4.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            11 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Fluidez Geral
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Transições:</strong> Novo motor Framer Motion para passagens de página ultra suaves.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Efeito Magnético:</strong> Micro-elevação tátil ao interagir com Cards de Transação.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.3.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.3.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            10 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Relatórios com Filtros
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Filtro por Mês:</strong> analise exatamente o mês que quiser com um seletor nativo.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Filtro por Período:</strong> botões rápidos de 3, 6 ou 12 meses.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Filtro Personalizado:</strong> intervalo de data livre (De → Até) com validação automática.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Todos os gráficos, cards e rankings reagem em tempo real ao filtro ativo.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Exportação Profissional
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>PDF:</strong> cabeçalho com logo FinControl, cards coloridos, tabelas separadas por tipo e rodapé profissional em todas as páginas.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>Excel:</strong> 3 abas separadas — Resumo, Categorias e Transações — com colunas otimizadas.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span><strong>CSV:</strong> com BOM UTF-8 e campos entre aspas, compatível com Excel Brasileiro.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.2.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.2.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            10 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Controle de Cartões de Crédito
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Página de cartões com fatura atual calculada em tempo real e barra de limite.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Vincule despesas a um cartão — elas <strong>não somam duas vezes</strong> no resumo mensal.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Assinaturas Melhorado
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Ícones reais de marca: Netflix, Spotify, Amazon, Apple, Google e Disney+.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Grupo "Assinaturas" adicionado no seletor de ícones para despesas.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v2.1.3 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.1.3</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            10 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Rastreador de Assinaturas
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Nova aba principal que encontra todos os pagamentos da sua conta marcados como "Recorrentes".</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Visualização do "Custo Mensal" e "Dreno Anual (12x)" de todas as assinaturas.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.1.2</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            10 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Feedback Tátil
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Vibração nativa em interações (Sucesso de edição, Alertas de Exclusão).</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Micro-vibrações ao abrir Menu, Dropdowns e Picker de Datas (só Mobile).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.1.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            9 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                App Nativo (PWA)
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Modo Fullscreen:</strong> Ocultamos a barra de status do sistema para imersão total.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Correções Visuais
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Ajuste automático de fonte para valores financeiros longos no mobile (sem obstrução).</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.1.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            9 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Experiência Mobile
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span><strong>Swipe-to-Action:</strong> Deslize em transações para editar ou excluir.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Interface & Teclado
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Teclado numérico nativo e extermínio do <code>&lt;select&gt;</code>.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.0.1</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6 font-medium italic flex items-center gap-1">
                            9 de Março de 2026
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-1 rounded" />
                                Orçamentos & Interface
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Definição de limites mensais personalizados por categoria com alertas visuais fluidos.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                                  <span>Entrada animada escalonada (Fade-in e Slide-up) nos gráficos interativos do Dashboard.</span>
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded" />
                                Core & Estabilidade
                              </h4>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-neutral-400">
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Sincronização Cloud: Orçamentos Inteligentes persistentes.</span>
                                </li>
                                <li className="flex items-start gap-2 bg-white/50 dark:bg-neutral-800/50 p-2 rounded-lg">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                  <span>Padronização do loop temporal infinito nas setas Tendência.</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 2.0.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-4 font-medium italic">Fevereiro de 2026</p>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mb-2">Lançamento da Plataforma v2</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-neutral-400 space-y-1 ml-1">
                                <li>Interface Glassmorphism redesenhada do zero.</li>
                                <li>Modo Escuro (Dark Mode) nativo de alta fidelidade.</li>
                                <li>Sistema de transações recorrentes inteligente.</li>
                                <li>Gráficos animados com Recharts.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* v0.4.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 0.4.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-4 font-medium italic">8 de Novembro de 2025</p>
                          <div className="space-y-4">
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-neutral-400 space-y-1 ml-1">
                              <li>Transações recorrentes.</li>
                              <li>Modal de confirmação de exclusão.</li>
                              <li>Atalhos de teclado.</li>
                              <li>Paleta de cores para categorias.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* v0.3.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 0.3.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-4 font-medium italic">5 de Novembro de 2025</p>
                          <div className="space-y-4">
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-neutral-400 space-y-1 ml-1">
                              <li>Página de relatórios e painéis gráficos interativos.</li>
                              <li>Exportação de dados.</li>
                              <li>Filtros avançados.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* v0.2.0 */}
                      <div className="relative pl-10 border-l-2 border-gray-200 dark:border-neutral-800">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Versão 0.2.0</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 mb-4 font-medium italic">1 de Novembro de 2025</p>
                          <div className="space-y-4">
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-neutral-400 space-y-1 ml-1">
                              <li>CRUD de categorias e Seletor de ícones.</li>
                              <li>Validação de formulários nativa.</li>
                              <li>Feedback visual e aprimoramento de UI.</li>
                            </ul>
                          </div>
                        </div>
                      </div>


                      {/* v0.1.0 */}
                      <div className="relative pl-10 border-l-2 border-transparent">
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-900 shadow-sm z-10" />
                        <div className="p-6 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-gray-500 dark:text-neutral-400">Versão 0.1.0</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded text-[10px] font-bold uppercase tracking-wider">Primeira Versão Lançada</span>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-neutral-500 mb-4 font-medium italic">28 de Outubro de 2025</p>
                          <div className="space-y-4">
                            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-neutral-500 space-y-1 ml-1">
                              <li>Estrutura inicial do projeto com React.</li>
                              <li>Sistema básico de autenticação.</li>
                              <li>Dashboard inicial e CRUD de transações.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default DesktopChangelogTab
