import { useDispatch, useSelector } from 'react-redux';
import VehicleCard from './VehicleCard';
import FilterSidebar from './FilterSidebar';
import { startReverseBiddingThunk } from '../redux/reverseBidSlice';
import { useNavigate } from 'react-router-dom';

export default function VehicleGrid({ cars }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((s) => s.reverseBid);

    const handleStart = async (car) => {
        const res = await dispatch(startReverseBiddingThunk(car));
        const payload = res?.payload;
        if (payload?.sessionId) {
            navigate(`/reverse-bidding/session/${payload.sessionId}`);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-0">
            {/* Filter Sidebar */}
            <div className="hidden lg:block lg:flex-shrink-0">
                <FilterSidebar cars={cars} />
            </div>

            {/* Vehicle Grid */}
            <div className="flex-1 lg:pl-6">
                {!cars?.length ? (
                    <div className="text-center py-16">
                        <div className="text-2xl font-semibold text-neutral-700">No vehicles match your criteria</div>
                        <div className="text-neutral-500 mt-2">Adjust your filters and try again.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((c) => (
                            <VehicleCard key={c.id} car={c} onStart={handleStart} loading={loading.session} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


