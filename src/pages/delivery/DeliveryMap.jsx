import { useState } from 'react';

const DeliveryMap = () => {
    const [online, setOnline] = useState(true);

    return (
        <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <div className="admin-page-header" style={{ marginBottom: '1rem' }}>
                <div>
                    <h1 className="admin-page-title">🗺️ Live Map</h1>
                    <p className="admin-page-subtitle">Track your delivery routes and nearby orders</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: online ? '#16a34a' : '#6b7280' }}>
                        {online ? 'You are Online' : 'You are Offline'}
                    </span>
                    <button 
                        className={`toggle-switch ${online ? 'toggle-on' : ''}`}
                        onClick={() => setOnline(!online)}
                        type="button"
                    >
                        <div className="toggle-thumb"></div>
                    </button>
                </div>
            </div>

            <div className="admin-card" style={{ flex: 1, margin: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#F0EBE3' }}>
                {/* Mock Map Background Placeholder */}
                <div style={{ 
                    position: 'absolute', inset: 0, 
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                    opacity: 0.1, zIndex: 1
                }}></div>
                
                {/* Embedded mock map container */}
                <div style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Mock Map Pins */}
                    {online ? (
                        <>
                            {/* Current Location */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                                <div style={{ width: '24px', height: '24px', background: '#3b82f6', borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
                                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '4px', background: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', color: '#374151', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>You</div>
                            </div>

                            {/* Nearby Available Order */}
                            <div style={{ position: 'absolute', top: '30%', left: '60%', transform: 'translate(-50%, -50%)', zIndex: 5, animation: 'pulse 2s infinite' }}>
                                <style>{`@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.1); } 100% { transform: translate(-50%, -50%) scale(1); } }`}</style>
                                <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>📍</div>
                                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '-4px', background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>New Order! (2.5km)</div>
                            </div>

                            {/* Active Delivery Destination */}
                            <div style={{ position: 'absolute', top: '70%', left: '40%', transform: 'translate(-50%, -50%)', zIndex: 4 }}>
                                <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>📦</div>
                                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '-4px', background: '#5C4033', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>ORD_882 Dropoff</div>
                            </div>

                            {/* Route Line Mock */}
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
                                <line x1="50%" y1="50%" x2="40%" y2="70%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" opacity="0.6" />
                            </svg>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', zIndex: 10 }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>😴</div>
                            <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>You are currently offline</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Toggle online status to start receiving orders and tracking locations.</p>
                            <button className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setOnline(true)}>Go Online Now</button>
                        </div>
                    )}
                </div>

                {/* Map Overlay Panel */}
                {online && (
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 20 }}>
                        <div style={{ background: 'white', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF9EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    🛵
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#374151' }}>En Route to ORD_882</div>
                                    <div style={{ fontSize: '0.75rem', color: '#5C4033', fontWeight: '600' }}>ETA: 8 mins (1.5 km left)</div>
                                </div>
                            </div>
                            <button className="admin-btn admin-btn-secondary" style={{ padding: '0.4rem 1rem' }}>Open external Maps ↗</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryMap;


