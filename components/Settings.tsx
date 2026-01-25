
import React from 'react';
import { UserSettings } from '../types';
import { Shield, Clock, Volume2, User, Key } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Security & Preferences</h2>
        <p className="text-slate-600">Configure your accessibility and safety settings.</p>
      </div>

      <div className="space-y-6">
        {/* Panic Word Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Shield size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Safety Protocol</h3>
              <p className="text-xs text-slate-500">Your emergency phrase.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Secret Panic Word</label>
              <input
                type="text"
                name="panicWord"
                value={settings.panicWord}
                onChange={handleChange}
                placeholder="e.g. Alaska"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition outline-none"
              />
              <p className="mt-2 text-xs text-slate-500 italic">
                * If you say this word during any voice interaction, your account will be instantly locked.
              </p>
            </div>
          </div>
        </section>

        {/* Voice Preferences */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Volume2 size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Voice Feedback</h3>
              <p className="text-xs text-slate-500">How the app speaks to you.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Voice Gender</label>
              <select
                name="voicePreference"
                value={settings.voicePreference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
              >
                <option value="female">Female (Puck)</option>
                <option value="male">Male (Charon)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Reminders</label>
              <input
                type="time"
                name="reminderTime"
                value={settings.reminderTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition outline-none"
              />
            </div>
          </div>
        </section>

        {/* API Info */}
        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
      <Key size={20} />
    </div>
    <div>
      <h3 className="font-bold text-slate-900">Developer API Keys</h3>
      <p className="text-xs text-slate-500">
        Available for approved integration partners.
      </p>
    </div>
  </div>

  <div className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
    <span className="text-slate-400 text-sm">
      No API key yet — sign up to request access
    </span>

    <a 
    href="/Header.tsx/Signup"
    className="text-blue-600 font-bold hover:underline shrink-0">
      Request API Key
    </a>
  </div>
</section>

<div className="pt-6">
  <button
    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold
               hover:bg-blue-700 transition shadow-lg shadow-blue-100"
  >
    Save All Changes
  </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
