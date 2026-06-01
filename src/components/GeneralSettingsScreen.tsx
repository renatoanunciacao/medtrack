import { ArrowLeft, BellRing, ChevronRight, FileText, FlaskConical, Info, LogOut, Moon, RefreshCw, ShieldAlert, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';

import { ScreenId } from '../types';

interface GeneralSettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClearAllData?: () => void;
  onLoadDemoData?: () => void;
}

export default function GeneralSettingsScreen({
  onNavigate,
  darkMode,
  onToggleDarkMode,
  onClearAllData,
  onLoadDemoData,
}: GeneralSettingsScreenProps) {
  return (
    <div className="flex-grow flex flex-col p-6 pb-28 text-on-surface animate-fade-in-up no-scrollbar overflow-y-auto">
      {/* Top Application Bar */}
      <header className="flex justify-between items-center h-16 border-b border-surface-container-highest/20 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-primary hover:bg-surface-container-high transition-colors duration-200 p-2 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <span className="font-headline text-md font-bold text-primary">Configurações</span>
        <div className="w-10"></div> {/* Spacer balance */}
      </header>

      {/* Main Container Lists */}
      <div className="flex flex-col gap-6 pt-2">
        {/* Profile Card Section */}
       criacao  

        {/* Preferences Section */}
        <section>
          <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2.5 px-1">
            Preferências
          </h3>
          
          <div className="bg-surface-container rounded-[20px] shadow-sm border border-outline-variant/10 overflow-hidden divide-y divide-surface-variant/40">
            {/* Toggle Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <Moon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Modo Escuro</span>
              </div>
              
              {/* iOS style toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={onToggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Standard dosing unit standard size */}
            <div
              onClick={() => alert('Unidade de dose padrão: miligramas (mg)')}
              className="flex items-center justify-between p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <FlaskConical className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Unidade de Dose Padrão</span>
              </div>
              <div className="flex items-center text-on-surface-variant">
                <span className="font-sans text-xs mr-1 font-semibold">mg</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Alarms reminder */}
            <div
              onClick={() => onNavigate('notification_settings')}
              className="flex items-center justify-between p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <BellRing className="w-4 h-4 text-primary" />
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Lembretes de Medicação</span>
              </div>
              <div className="flex items-center text-on-surface-variant">
                <span className="font-sans text-xs mr-1 font-semibold">Ativo</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Test Data Settings Section */}
        <section className="bg-gradient-to-br from-primary/10 to-teal-500/5 rounded-2xl p-5 border border-primary/20 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-headline text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
              Banco de Dados & Testes
            </h3>
            <p className="font-sans text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
              Configure o estado de dados para seus testes com usuários. Comece do absoluto zero (Fresh Account) ou restaure carregamentos exemplo para demonstração rápida.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Isso excluirá permanentemente todos os medicamentos cadastrados e históricos de sintomas. Deseja continuar com o reset?")) {
                  onClearAllData?.();
                }
              }}
              className="px-3 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-sans text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center text-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Limpar Conta (Fresh Test)</span>
            </button>

            <button
              type="button"
              onClick={() => onLoadDemoData?.()}
              className="px-3 py-3 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary rounded-xl font-sans text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center text-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Carregar Demo (Mocks)</span>
            </button>
          </div>
        </section>

        {/* Legal/About Section */}
        <section>
          <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2.5 px-1">
            Sobre
          </h3>
          <div className="bg-surface-container rounded-[20px] shadow-sm border border-outline-variant/10 overflow-hidden divide-y divide-surface-variant/40">
            {/* Termos de uso */}
            <div
              onClick={() => alert('Abrindo Termos de Uso (Simulado)...')}
              className="flex items-center justify-between p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Termos de Uso</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>

            {/* Politica privacidade */}
            <div
              onClick={() => alert('Abrindo Política de Privacidade (Simulado)...')}
              className="flex items-center justify-between p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="font-sans text-xs font-semibold text-on-surface">Política de Privacidade</span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </div>
          </div>
        </section>

        {/* Warnings notice disclaimer box */}
        <section className="bg-error-container/10 border border-error-container/20 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
          <Info className="w-5 h-5 text-error mt-0.5 shrink-0" />
          <p className="font-sans text-xs text-on-surface leading-relaxed">
            <strong className="font-bold block mb-1 text-error text-[11px] uppercase tracking-wider">Aviso Médico</strong>
            Este aplicativo não substitui orientação médica profissional. Use os medicamentos conforme a devida prescrição de seu especialista.
          </p>
        </section>

        {/* Exit logout door trigger button */}
        <button
          onClick={() => {
            alert('Sessão encerrada! Retornando à tela de Onboarding.');
            onNavigate('onboarding');
          }}
          className="w-full flex items-center justify-center gap-2 font-sans text-xs font-bold text-error py-4 hover:bg-error-container/10 rounded-xl transition-all border border-transparent hover:border-error-container/20 cursor-pointer min-h-[50px] mb-2"
        >
          <LogOut className="w-4 h-4 text-error" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
