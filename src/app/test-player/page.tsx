"use client";

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export default function TestPlayerPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [url, setUrl] = useState("https://vip.opstream10.com/20260106/32194_01bfa6f2/index.m3u8");
    const [forceHLS, setForceHLS] = useState(true);
    const [withCredentials, setWithCredentials] = useState(false);
    const [useNativeControls, setUseNativeControls] = useState(true);
    const [forceVideo, setForceVideo] = useState(false);

    const playerRef = useRef<any>(null);

    useEffect(() => {
        setIsMounted(true);
        addLog("Player mounted.");
        // Check for HLS support
        if (typeof window !== 'undefined' && window.MediaSource) {
            addLog(`MSE Supported: true`);
        } else {
            addLog(`MSE Supported: false (likely using native HLS)`);
        }
    }, []);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    if (!isMounted) return <div className="p-10 text-white">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-4 gap-4">
            <h1 className="text-2xl font-bold">Debug Test Player</h1>

            <div className="w-full max-w-4xl flex gap-4">
                <input
                    className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-sm font-mono text-white"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button variant="secondary" onClick={() => setLogs([])}>Clear Logs</Button>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={forceHLS} onChange={e => setForceHLS(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Force HLS (hls.js)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={withCredentials} onChange={e => setWithCredentials(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">With Credentials</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={useNativeControls} onChange={e => setUseNativeControls(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Native Controls</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={forceVideo} onChange={e => setForceVideo(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Force Video Tag</span>
                </label>
            </div>

            <div className="w-full max-w-4xl aspect-video border border-white/20 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                {forceVideo ? (
                    <video
                        src={url}
                        controls={useNativeControls}
                        className="w-full h-full"
                        onError={(e: any) => addLog(`Video Tag Error: ${e.target?.error?.message || e.target?.error?.code || 'Unknown'}`)}
                        onLoadedMetadata={() => addLog("Video Tag: Loaded Metadata")}
                    />
                ) : (
                    <ReactPlayer
                        key={`${forceHLS}-${withCredentials}`}
                        ref={playerRef}
                        url={url}
                        width="100%"
                        height="100%"
                        controls={useNativeControls}
                        playing={true}
                        onReady={() => addLog("ReactPlayer: Ready")}
                        onStart={() => addLog("ReactPlayer: Start")}
                        onBuffer={() => addLog("ReactPlayer: Buffer")}
                        onBufferEnd={() => addLog("ReactPlayer: BufferEnd")}
                        onEnded={() => addLog("ReactPlayer: Ended")}
                        onError={(e: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => {
                            console.error("Player Error", e, data);
                            addLog(`ReactPlayer Error: ${e?.message || e?.type || 'Unknown error'}`);
                            if (data) {
                                if (data.type === 'networkError') {
                                    addLog(`HLS Network Detailed: ${data.details} - Status: ${data.response?.code || 'N/A'} - URL: ${data.url}`);
                                } else {
                                    addLog(`HLS Error Details: ${data.type} - ${data.details}`);
                                }
                                if (data.fatal) {
                                    addLog(`FATAL ERROR encountered`);
                                }
                            }
                        }}
                        config={{
                            file: {
                                forceHLS: forceHLS,
                                hlsOptions: {
                                    debug: false,
                                    xhrSetup: (xhr: XMLHttpRequest) => {
                                        if (withCredentials) {
                                            xhr.withCredentials = true;
                                        }
                                    }
                                },
                                attributes: {
                                    crossOrigin: "anonymous"
                                }
                            }
                        } as any}
                    />
                )}
            </div>

            <div className="w-full max-w-4xl h-64 bg-gray-950 border border-gray-800 rounded p-0 overflow-hidden flex flex-col">
                <div className="bg-gray-900 p-2 text-xs font-bold uppercase tracking-wider border-b border-gray-800 flex justify-between items-center">
                    <span>Debug Console</span>
                    <span className="text-gray-500 text-[10px]">{logs.length} events</span>
                </div>
                <div className="flex-1 overflow-auto p-2 space-y-1 font-mono text-xs">
                    {logs.length === 0 && <span className="text-gray-600 italic">No logs yet...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="border-b border-gray-900/50 pb-0.5 text-gray-300 break-all">{log}</div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-4xl text-xs text-gray-500">
                <p>Note: If you see "Network Error" with status 0 or undefined, it is typically a CORS issue (Access-Control-Allow-Origin).</p>
                <p>If you see "manifestLoadError" with 403, it is likely a blocking issue (GeoIP, Referrer, Token).</p>
            </div>
        </div>
    );
}
