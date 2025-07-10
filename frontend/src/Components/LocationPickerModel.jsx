import { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../Contexts/GoogleMapContext";

export default function LocationPickerModal({ initialLocation, onSelect, buttonLabel = "Choose Location" }) {
    const { isLoaded, loadError } = useGoogleMaps();
    const [open, setOpen] = useState(false);
    const [loc, setLoc] = useState(initialLocation);

    if (loadError) return <p>Error loading maps.</p>;

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {buttonLabel}
            </button>

            {open && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50"
                        onClick={() => { setOpen(false) }}
                    ></div>
                    <div className="relative z-50 bg-white rounded-lg shadow-lg w-11/12 max-w-6xl">
                        <header className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Select Location</h2>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(false);
                                }}
                                className="text-gray-600"
                            >✕</button>
                        </header>

                        <div className="p-4">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "500px" }}
                                    center={loc}
                                    zoom={loc ? 14 : 6}
                                    onClick={(e) => setLoc({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                                >
                                    {loc && <Marker position={loc} />}
                                </GoogleMap>
                            ) : (
                                <p>Loading map...</p>
                            )}
                        </div>

                        <footer className="p-4 border-t flex justify-end space-x-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(false)
                                }}
                                className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelect(loc);
                                    setOpen(false);
                                }}
                                disabled={!loc}
                                className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
                            >
                                Confirm
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
}
