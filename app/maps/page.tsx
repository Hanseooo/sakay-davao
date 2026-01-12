import { Map, MapControls } from "@/components/ui/map";


export default function Maps() {

    return(
        <main className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center mb-2">
                <h1 className="font-bold text-2xl">Interactive Map</h1>
                <p>View Bus Routes using the interactive Map</p>
            </div>
            <div className="w-full sm:w-[92vw] h-92 mt-2">
                <Map center={[125.6094, 7.0661]} zoom={12} >
                <MapControls
                    position="bottom-right"
                    showZoom
                    showCompass
                    showLocate
                    showFullscreen
                    />
                </Map>
            </div>
        </main>
    )
}