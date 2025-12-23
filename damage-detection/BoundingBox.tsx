
import React from 'react';
import type { Damage, ImageDimensions } from '../types';

interface BoundingBoxProps {
    box: Damage['boundingBox'];
    imageDims: ImageDimensions;
    index: number;
    description: string;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ box, imageDims, index, description }) => {
    if (!imageDims.width || !imageDims.height) return null;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${box.x * imageDims.width}px`,
        top: `${box.y * imageDims.height}px`,
        width: `${box.width * imageDims.width}px`,
        height: `${box.height * imageDims.height}px`,
        border: '3px solid #ef4444', // red-500
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.7)',
        pointerEvents: 'none', // The box itself shouldn't capture events
    };
    
    const labelContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-1.8rem',
        left: '0',
        pointerEvents: 'auto', // The label should be interactive
    };

    return (
        <div style={style} className="z-10">
            <div className="relative group" style={labelContainerStyle}>
                {/* Number Badge */}
                <span 
                    className="bg-red-500 text-white font-bold text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center w-6 h-6"
                    style={{ textShadow: '1px 1px 1px rgba(0, 0, 0, 0.6)' }}
                >
                    {index + 1}
                </span>

                {/* Tooltip with Description */}
                <div className="absolute bottom-full left-0 mb-2 w-max max-w-xs bg-gray-900 text-white text-sm rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                    {description}
                </div>
            </div>
        </div>
    );
};


export default BoundingBox;
