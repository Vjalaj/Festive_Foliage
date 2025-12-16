"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChristmasTree } from '@/components/festive/ChristmasTree';
import { DraggableDecoration } from '@/components/festive/DraggableDecoration';
import { FallingSnow } from '@/components/festive/FallingSnow';
import { AdminActionPopup } from '@/components/festive/AdminActionPopup';
import { ChevronUp, ChevronDown, LogOut, Shield, Trash2, Ban, UserX } from 'lucide-react';
import type { Decoration } from '@/lib/types';

export default function AdminPage() {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'decorations' | 'blocks'>('decorations');
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { toast } = useToast();
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/decorations');
        if (res.ok) {
          const data = await res.json();
          setDecorations(data || []);
        }
      } catch (e) {}
    };
    load();
  }, []);

  const login = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cred = btoa(`${user}:${pass}`);
    try {
      const res = await fetch('/api/decorations', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'authorization': `Basic ${cred}` },
        body: JSON.stringify({}),
      });
      if (res.status === 401) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'Invalid admin credentials.' });
        return;
      }
      localStorage.setItem('adminToken', cred);
      setToken(cred);
      toast({ title: '🔓 Logged in', description: 'Admin access granted.' });
      const r2 = await fetch('/api/decorations');
      if (r2.ok) setDecorations(await r2.json());
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Login failed.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser('');
    setPass('');
    toast({ title: '👋 Logged out' });
  };

  const removeDecoration = async (id: string) => {
    if (!token) return toast({ variant: 'destructive', title: 'Not logged in' });
    try {
      const res = await fetch('/api/decorations', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'authorization': `Basic ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const body = await res.json();
        setDecorations(body.decorations || []);
        toast({ title: '🗑️ Removed', description: 'Decoration deleted.' });
      } else if (res.status === 401) {
        toast({ variant: 'destructive', title: 'Unauthorized' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error' });
    }
  };

  // Admin cannot move decorations - this is a no-op
  const updateDecoration = useCallback((id: string, updates: Partial<Decoration>) => {
    // No-op for admin - decorations are view-only
  }, []);

  // Handle decoration click to show popup
  const handleDecorationClick = useCallback((decoration: Decoration, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDecoration(decoration);
    setPopupPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockInput, setBlockInput] = useState('');

  const loadBlocks = useCallback(async () => {
    try {
      const res = await fetch('/api/blocks');
      if (res.ok) setBlocks(await res.json());
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (token) loadBlocks();
  }, [token, loadBlocks]);

  const block = async (payload: { ip?: string; session?: string; reason?: string }) => {
    if (!token) return toast({ variant: 'destructive', title: 'Not logged in' });
    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'authorization': `Basic ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const entry = await res.json();
        setBlocks((b) => [...b, entry]);
        toast({ title: '🚫 Blocked' });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error' });
    }
  };

  const unblock = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/blocks', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'authorization': `Basic ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const body = await res.json();
        setBlocks(body.blocks || []);
        toast({ title: '✅ Unblocked' });
      }
    } catch (e) {}
  };

  const handleManualBlock = () => {
    if (!blockInput.trim()) return;
    const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(blockInput.trim());
    if (isIP) {
      block({ ip: blockInput.trim() });
    } else {
      block({ session: blockInput.trim() });
    }
    setBlockInput('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#1a365d] overflow-hidden">
        <FallingSnow />
        
        {/* Phone-sized container */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-black/20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
            
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 shrink-0">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Admin Panel
              </h1>
              {token && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              )}
            </header>

            {!token ? (
              /* Login form */
              <div className="flex-1 flex items-center justify-center p-6">
                <form onSubmit={login} className="w-full max-w-xs space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🔐</div>
                    <h2 className="text-xl font-bold text-white">Admin Login</h2>
                    <p className="text-white/50 text-sm mt-1">Enter credentials to manage</p>
                  </div>
                  <Input 
                    placeholder="Username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <Input 
                    type="password"
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <Button type="submit" className="w-full h-11 bg-red-600 hover:bg-red-700 text-white">
                    Login
                  </Button>
                </form>
              </div>
            ) : (
              <>
                {/* Tree view area */}
                <div 
                  ref={treeRef}
                  className="flex-1 relative overflow-hidden"
                  style={{ minHeight: panelOpen ? '40%' : '80%' }}
                >
                  <ChristmasTree onDrop={() => {}}>
                    {decorations.map((decoration) => (
                      <DraggableDecoration 
                        key={decoration.id} 
                        decoration={decoration} 
                        onUpdate={updateDecoration}
                        onRemove={(id) => {
                          const d = decorations.find(dec => dec.id === id);
                          if (d) {
                            setSelectedDecoration(d);
                            setPopupPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                          }
                        }}
                        isAdmin={true}
                        onAdminClick={handleDecorationClick}
                      />
                    ))}
                  </ChristmasTree>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => setPanelOpen(!panelOpen)}
                  className="w-full py-2 bg-black/40 border-t border-b border-white/10 flex items-center justify-center gap-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {panelOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  <span className="text-sm font-medium">
                    {panelOpen ? 'Hide Panel' : 'Show Panel'}
                  </span>
                </button>

                {/* Admin panel */}
                {panelOpen && (
                  <div className="shrink-0 bg-black/30 overflow-hidden" style={{ height: '45%' }}>
                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveTab('decorations')}
                        className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                          activeTab === 'decorations' 
                            ? 'text-white bg-white/10 border-b-2 border-red-400' 
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Decorations ({decorations.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('blocks')}
                        className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                          activeTab === 'blocks' 
                            ? 'text-white bg-white/10 border-b-2 border-red-400' 
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Ban className="w-4 h-4" />
                        Blocked ({blocks.length})
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 overflow-auto" style={{ height: 'calc(100% - 44px)' }}>
                      {activeTab === 'decorations' ? (
                        <div className="space-y-2">
                          {decorations.length === 0 ? (
                            <p className="text-white/40 text-center py-8 text-sm">No decorations yet</p>
                          ) : decorations.map((d) => (
                            <div key={d.id} className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white text-sm truncate">{d.name || d.type}</div>
                                <div className="text-[10px] text-white/40 truncate">
                                  {d.ip || '?'} • {d.session?.slice(0,10) || '?'}
                                </div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => removeDecoration(d.id)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                {d.ip && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => block({ ip: d.ip })}
                                    className="h-7 px-2 text-[10px] bg-orange-600 hover:bg-orange-700"
                                  >
                                    Block IP
                                  </Button>
                                )}
                                {d.session && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => block({ session: d.session })}
                                    className="h-7 px-2 text-[10px] bg-purple-600 hover:bg-purple-700"
                                  >
                                    <UserX className="w-3 h-3 mr-1" />
                                    Ban
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Manual block input */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="IP or Session ID"
                              value={blockInput}
                              onChange={(e) => setBlockInput(e.target.value)}
                              className="h-9 bg-white/10 border-white/20 text-white text-sm placeholder:text-white/40"
                              onKeyDown={(e) => e.key === 'Enter' && handleManualBlock()}
                            />
                            <Button 
                              onClick={handleManualBlock}
                              className="h-9 px-3 bg-red-600 hover:bg-red-700"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Block list */}
                          {blocks.length === 0 ? (
                            <p className="text-white/40 text-center py-6 text-sm">No blocked users</p>
                          ) : blocks.map((b) => (
                            <div key={b.id} className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white text-sm truncate">
                                  {b.ip ? `IP: ${b.ip}` : `Session: ${b.session?.slice(0, 16)}...`}
                                </div>
                                <div className="text-[10px] text-white/40">
                                  {new Date(b.blockedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => unblock(b.id)}
                                className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 text-xs"
                              >
                                Unblock
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Admin Action Popup */}
        {selectedDecoration && token && (
          <AdminActionPopup
            decoration={selectedDecoration}
            position={popupPosition}
            onRemove={removeDecoration}
            onBlockIP={(ip) => block({ ip })}
            onBlockSession={(session) => block({ session })}
            onClose={() => setSelectedDecoration(null)}
          />
        )}
      </div>
    </DndProvider>
  );
}
