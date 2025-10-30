import { motion } from 'framer-motion';

export default function VehicleCard({ car, onStart }) {
    return (
        <motion.div
            className="group overflow-hidden rounded-2xl border border-neutral-200/50 hover:border-orange-400/50 transition-all duration-500 shadow-lg hover:shadow-2xl bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="relative h-56 overflow-hidden">
                <img src={car.images?.[0]} alt="car" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs backdrop-blur-md bg-white/60">New Arrival</div>
            </div>
            <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold tracking-tight truncate">{car.year} {car.make} {car.model}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${(car.basePrice || 0).toLocaleString()}</span>
                    <span className="text-xs text-neutral-500">MSRP</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <span>{car.dealer?.name} • {car.dealer?.location}</span>
                </div>
                <button onClick={() => onStart(car)} className="cursor-pointer w-full mt-2 inline-flex items-center justify-center rounded-lg px-3 py-2 bg-neutral-900 text-white font-medium group/btn">
                    <span>Start Reverse Bidding</span>
                    <span className="ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                </button>
            </div>
        </motion.div>
    );
}


