import React from 'react'
import {
  ArrowUpRight,
  Smartphone,
  Info,
  Bell,
  Wifi,
  Battery,
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  User,
  ArrowDownLeft,
  QrCode,
  Layers,
} from 'lucide-react'
import { getDynamicIcon } from '@/utils/iconMapping'

interface MobileCardLivePreviewProps {
  title: string
  desc: string
  icon?: string
  imageSrc?: string
  bg: string
  textColor: string
  descColor: string
  iconColor?: string
  iconBg?: string
  actionPath: string
}

export const MobileCardLivePreview: React.FC<MobileCardLivePreviewProps> = ({
  title,
  desc,
  icon,
  imageSrc,
  bg,
  textColor,
  descColor,
  iconColor,
  iconBg,
  actionPath,
}) => {
  const IconComponent = getDynamicIcon(icon)

  return (
    <div className="flex flex-col items-center w-full max-w-[320px] select-none py-1">
      {/* Label de contexto */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-neutral-500 mb-2.5 uppercase tracking-wider">
        <Smartphone className="w-3.5 h-3.5 text-primary-500" />
        <span>Prévia no Smartphone</span>
      </div>

      {/* Chassi Físico do Smartphone com Botões de Hardware */}
      <div className="relative">
        {/* Botão de Ação / Silencioso (Esquerda) */}
        <div className="absolute -left-[3.5px] top-[75px] w-[3.5px] h-[16px] bg-neutral-600 dark:bg-neutral-700 rounded-l-xs shadow-xs" />
        {/* Botão Volume + (Esquerda) */}
        <div className="absolute -left-[3.5px] top-[104px] w-[3.5px] h-[34px] bg-neutral-600 dark:bg-neutral-700 rounded-l-xs shadow-xs" />
        {/* Botão Volume - (Esquerda) */}
        <div className="absolute -left-[3.5px] top-[148px] w-[3.5px] h-[34px] bg-neutral-600 dark:bg-neutral-700 rounded-l-xs shadow-xs" />
        {/* Botão Power / Bloqueio (Direita) */}
        <div className="absolute -right-[3.5px] top-[115px] w-[3.5px] h-[48px] bg-neutral-600 dark:bg-neutral-700 rounded-r-xs shadow-xs" />

        {/* Corpo do Dispositivo (Bordas Titânio e Chanfro Apple) */}
        <div className="w-[276px] h-[520px] bg-neutral-900 dark:bg-neutral-950 p-[8px] rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.12)] border border-neutral-750 flex flex-col relative overflow-hidden">
          
          {/* Tela OLED Interna */}
          <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[36px] overflow-hidden flex flex-col justify-between relative shadow-inner border border-gray-200/50 dark:border-neutral-800">
            
            {/* 1. Barra de Status com Dynamic Island */}
            <div className="pt-2 px-4 flex items-center justify-between text-neutral-900 dark:text-white z-20">
              {/* Horário */}
              <span className="text-[11px] font-bold tracking-tight">9:41</span>

              {/* Dynamic Island Centrada */}
              <div className="w-[78px] h-[20px] bg-black rounded-full flex items-center justify-between px-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-indigo-950" />
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              </div>

              {/* Indicadores do Sistema */}
              <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white opacity-90">
                <span className="text-[9px] font-bold tracking-tighter">5G</span>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Área do Conteúdo do App FinControl */}
            <div className="flex-1 px-3 pt-2 pb-1 overflow-hidden flex flex-col justify-between">
              
              {/* Cabeçalho do App no Smartphone */}
              <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold text-[10px] flex items-center justify-center border border-primary-200/50 dark:border-primary-800/40">
                    P
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium leading-none">
                      FinControl
                    </p>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white leading-tight">
                      Olá, Pedro
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-neutral-400 relative">
                  <Bell className="w-3 h-3" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 absolute top-1 right-1" />
                </div>
              </div>

              {/* Mini Card de Saldo */}
              <div className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-neutral-800/50 border border-gray-150 dark:border-neutral-800">
                <span className="text-[8px] uppercase tracking-wider text-gray-400 dark:text-neutral-500 font-bold">
                  Saldo Disponível
                </span>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white font-display">
                  R$ 14.850,00
                </p>
              </div>

              {/* Seção do Carrossel de Avisos (Onde o Card Vive) */}
              <div className="space-y-1.5 my-auto">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 flex items-center gap-1">
                    <span>Avisos & Comunicados</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1 rounded-full bg-primary-500" />
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-neutral-700" />
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-neutral-700" />
                  </div>
                </div>

                {/* Área Horizontal do Carrossel */}
                <div className="relative overflow-visible">
                  <div className="flex gap-2 items-stretch">
                    
                    {/* O Card Configurado em Tempo Real */}
                    <div
                      className={`w-[220px] min-h-[105px] p-3 rounded-2xl flex flex-col justify-between text-left shadow-sm flex-shrink-0 transition-all duration-150 ${
                        bg || 'bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800'
                      }`}
                    >
                      {/* Topo do Card */}
                      <div className="flex items-center justify-between w-full">
                        {imageSrc ? (
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200/30 flex-shrink-0">
                            <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : IconComponent ? (
                          <div
                            className={`w-7 h-7 rounded-lg ${
                              iconBg || 'bg-primary-50 dark:bg-primary-950/20'
                            } flex items-center justify-center flex-shrink-0`}
                          >
                            <IconComponent
                              className={`w-3.5 h-3.5 ${
                                iconColor || 'text-primary-600 dark:text-primary-400'
                              }`}
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <ArrowUpRight
                          className={`w-3.5 h-3.5 opacity-70 flex-shrink-0 ${
                            textColor || 'text-gray-900 dark:text-white'
                          }`}
                        />
                      </div>

                      {/* Textos do Card */}
                      <div className="mt-1.5">
                        <p
                          className={`text-[11px] font-bold ${
                            textColor || 'text-gray-900 dark:text-white'
                          } line-clamp-1`}
                        >
                          {title || 'Título do card'}
                        </p>
                        <p
                          className={`text-[9px] mt-0.5 ${
                            descColor || 'text-gray-500 dark:text-neutral-400'
                          } line-clamp-2 leading-tight`}
                        >
                          {desc || 'Descrição do comunicado que aparecerá no carrossel do dashboard mobile.'}
                        </p>
                      </div>
                    </div>

                    {/* Dica Visual do Próximo Card no Carrossel */}
                    <div className="w-[20px] min-h-[105px] p-2 bg-gray-100 dark:bg-neutral-800/40 border border-gray-200/40 dark:border-neutral-700/40 rounded-2xl flex-shrink-0 opacity-40" />
                  </div>
                </div>
              </div>

              {/* Botões de Ações Rápidas do App */}
              <div className="grid grid-cols-4 gap-1.5 py-1">
                {[
                  { label: 'Pix', icon: QrCode },
                  { label: 'Pagar', icon: ArrowDownLeft },
                  { label: 'Cartão', icon: CreditCard },
                  { label: 'Metas', icon: Layers },
                ].map((action, i) => {
                  const ActionIcon = action.icon
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-neutral-800/70 border border-gray-100 dark:border-neutral-800 flex items-center justify-center text-gray-700 dark:text-neutral-300 shadow-2xs">
                        <ActionIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[8px] font-medium text-gray-500 dark:text-neutral-400">
                        {action.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Barra de Navegação Inferior (Tab Bar) */}
            <div className="px-3 py-1.5 border-t border-gray-100 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 flex items-center justify-around text-gray-400 dark:text-neutral-500">
              <div className="flex flex-col items-center gap-0.5 text-primary-600 dark:text-primary-400">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="text-[7px] font-bold">Início</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="text-[7px] font-medium">Extrato</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span className="text-[7px] font-medium">Cartões</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <User className="w-3.5 h-3.5" />
                <span className="text-[7px] font-medium">Perfil</span>
              </div>
            </div>

            {/* 4. Barra Home Indicator do iOS */}
            <div className="w-full pb-1 pt-0.5 flex justify-center bg-white dark:bg-neutral-900">
              <div className="w-24 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            </div>

          </div>
        </div>
      </div>

      {/* Rota de Ação */}
      <p className="text-[10px] text-gray-400 dark:text-neutral-500 mt-2.5 font-mono truncate max-w-[280px]">
        Atalho: {actionPath || '/app/dashboard'}
      </p>
    </div>
  )
}

export default MobileCardLivePreview
