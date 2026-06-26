"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, MapPin, X, Navigation, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Fix default leaflet marker icon assets paths in Next.js bundle
const pinIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number, address: string) => void;
  initialCoords: { lat: number; lng: number } | null;
  initialAddress: string;
}

// Map event handling helper component to detect click and set marker position
function MapEventsHandler({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

// Map view panning helper component
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function LocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialCoords,
  initialAddress,
}: LocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number }>(
    initialCoords || { lat: 11.2588, lng: 75.7804 } // default center
  );
  const [tempAddress, setTempAddress] = useState(initialAddress || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  
  // Autocomplete suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  // Saved locations
  const [savedLocs, setSavedLocs] = useState<SavedLocation[]>([]);
  const [customLabel, setCustomLabel] = useState("");

  // Debounce autocomplete search suggestions for Search Address/Area field
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (searchQuery === tempAddress) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setFetchingSuggestions(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, tempAddress]);

  useEffect(() => {
    setMounted(true);
    // Load saved locations from local storage
    try {
      const stored = localStorage.getItem("medifind_saved_locations");
      if (stored) {
        setSavedLocs(JSON.parse(stored));
      } else {
        const defaults: SavedLocation[] = [
          { id: "1", name: "Home", lat: 11.2588, lng: 75.7804, address: "Kozhikode City, Kerala" },
        ];
        setSavedLocs(defaults);
        localStorage.setItem("medifind_saved_locations", JSON.stringify(defaults));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update temp fields when modal opens/receives values
  useEffect(() => {
    if (initialCoords) {
      setTempCoords(initialCoords);
    }
    if (initialAddress) {
      setTempAddress(initialAddress);
    }
  }, [initialCoords, initialAddress, isOpen]);

  if (!isOpen || !mounted) return null;

  // Address search (Geocoding) via Nominatim
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setTempCoords({ lat, lng });
        setTempAddress(data[0].display_name);
      } else {
        alert("Location not found. Please try a different query.");
      }
    } catch {
      alert("Error searching location. Please check your network connection.");
    } finally {
      setSearching(false);
    }
  };

  // Coordinates reverse geocoding via Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      setTempAddress(
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.display_name ||
        "Custom Location"
      );
    } catch {
      setTempAddress("Custom Location Coordinates");
    }
  };

  // Geolocation detection
  const detectCurrentLocation = () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setTempCoords({ lat, lng });
        await reverseGeocode(lat, lng);
        setDetecting(false);
      },
      () => {
        alert("Location permission denied or lookup failed.");
        setDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Add saved location
  const saveCurrentLocation = () => {
    if (!customLabel.trim()) return;
    const newLoc: SavedLocation = {
      id: Date.now().toString(),
      name: customLabel,
      lat: tempCoords.lat,
      lng: tempCoords.lng,
      address: tempAddress,
    };
    const updated = [...savedLocs, newLoc];
    setSavedLocs(updated);
    localStorage.setItem("medifind_saved_locations", JSON.stringify(updated));
    setCustomLabel("");
  };

  // Delete saved location
  const deleteSavedLocation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedLocs.filter((l) => l.id !== id);
    setSavedLocs(updated);
    localStorage.setItem("medifind_saved_locations", JSON.stringify(updated));
  };

  const handleApply = () => {
    onSelectLocation(tempCoords.lat, tempCoords.lng, tempAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-surface">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-ink">Select Search Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-ink-muted hover:text-ink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left Panel: Search & Saved Locations */}
          <div className="lg:col-span-4 flex flex-col gap-5 max-h-[50vh] lg:max-h-none">
            
            {/* 1. Address Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Search Address / Area</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter city or zip..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm font-semibold text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                  <Search className="w-4 h-4 text-ink-faint absolute left-3 top-3" />

                  {/* Autocomplete Suggestions Dropdown */}
                  {showSuggestions && searchQuery && searchQuery.trim().length >= 3 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-[110] max-h-[180px] overflow-y-auto">
                      {fetchingSuggestions && (
                        <div className="px-3 py-2 text-xs text-ink-muted font-semibold flex items-center gap-1.5 bg-surface/50">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          Searching...
                        </div>
                      )}
                      {!fetchingSuggestions && suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const lat = parseFloat(item.lat);
                            const lng = parseFloat(item.lon);
                            setTempCoords({ lat, lng });
                            setTempAddress(item.display_name);
                            setSearchQuery(item.display_name);
                            setShowSuggestions(false);
                          }}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-surface text-xs font-semibold text-ink truncate border-b border-gray-100 last:border-b-0 cursor-pointer"
                        >
                          {item.display_name}
                        </button>
                      ))}
                      {!fetchingSuggestions && suggestions.length === 0 && (
                        <div className="px-3 py-2 text-xs text-ink-faint font-medium text-center bg-surface/50">
                          No suggestions found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button onClick={handleSearch} disabled={searching} className="px-3 py-2 h-9 text-xs">
                  {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Find"}
                </Button>
              </div>
            </div>

            {/* 2. Detect location button */}
            <button
              onClick={detectCurrentLocation}
              disabled={detecting}
              className="w-full py-2.5 px-4 bg-emerald-50 text-primary border border-primary/20 hover:bg-primary-subtle text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {detecting ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Navigation className="w-4 h-4 text-primary fill-primary/10" />
              )}
              <span>{detecting ? "Locating..." : "Use Current GPS Location"}</span>
            </button>

            {/* 3. Saved Locations list */}
            <div className="flex-1 flex flex-col min-h-0">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">Saved Places</span>
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[180px] lg:max-h-none pr-1">
                {savedLocs.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setTempCoords({ lat: loc.lat, lng: loc.lng });
                      setTempAddress(loc.address);
                    }}
                    className={`p-2.5 rounded-md border text-left cursor-pointer transition-all flex items-center justify-between group ${
                      Math.abs(tempCoords.lat - loc.lat) < 0.0001 && Math.abs(tempCoords.lng - loc.lng) < 0.0001
                        ? "bg-primary-subtle border-primary text-primary"
                        : "bg-surface border-gray-100 hover:border-gray-200 text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <MapPin className="w-4 h-4 shrink-0 opacity-70" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate">{loc.name}</span>
                        <span className="text-[10px] text-ink-muted truncate font-medium">{loc.address}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteSavedLocation(loc.id, e)}
                      className="text-ink-faint hover:text-danger opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {savedLocs.length === 0 && (
                  <p className="text-xs font-medium text-ink-faint text-center py-4">No saved places yet.</p>
                )}
              </div>
            </div>

            {/* 4. Save Location form */}
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block mb-1.5">Save Current Selection</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Work, Mother's House..."
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-semibold text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <Button
                  onClick={saveCurrentLocation}
                  disabled={!customLabel.trim()}
                  className="px-3 h-8 text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </Button>
              </div>
            </div>

          </div>

          {/* Right Panel: Interactive Leaflet Map */}
          <div className="lg:col-span-8 flex flex-col gap-3 min-h-[300px] lg:min-h-none h-full relative">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Map (Drag Pin or Click Map to adjust)
            </span>
            <div className="flex-1 w-full rounded-md border border-gray-200 overflow-hidden relative min-h-[280px] lg:min-h-0 h-full shadow-inner bg-surface">
              <MapContainer
                center={[tempCoords.lat, tempCoords.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[tempCoords.lat, tempCoords.lng]}
                  icon={pinIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      setTempCoords({ lat: position.lat, lng: position.lng });
                      reverseGeocode(position.lat, position.lng);
                    },
                  }}
                />
                <MapEventsHandler
                  onClick={(latlng) => {
                    setTempCoords({ lat: latlng.lat, lng: latlng.lng });
                    reverseGeocode(latlng.lat, latlng.lng);
                  }}
                />
                <ChangeMapView center={[tempCoords.lat, tempCoords.lng]} />
              </MapContainer>
            </div>
            
            {/* Active Selected Location coordinates / address text */}
            <div className="p-3 bg-surface border border-gray-100 rounded-md flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Selected Address</span>
              <span className="text-xs font-bold text-ink truncate leading-tight">
                {tempAddress || "Selecting location..."}
              </span>
              <span className="text-[9px] text-ink-muted font-mono mt-0.5">
                Lat: {tempCoords.lat.toFixed(5)} • Lng: {tempCoords.lng.toFixed(5)}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-ink font-semibold text-xs rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <Button onClick={handleApply} className="px-5 py-2 font-bold text-xs h-9">
            Apply Location
          </Button>
        </div>

      </div>
    </div>
  );
}
