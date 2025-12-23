import React, { useState, useRef, useEffect } from 'react';

/**
 * BoundingBox component for displaying damage overlays on images
 * @param {Object} props
 * @param {Object} props.box - Bounding box coordinates {x, y, width, height} (normalized 0-1)
 * @param {Object} props.imageDims - Image dimensions {width, height} in pixels
 * @param {number} props.index - Damage index (for numbering)
 * @param {string} props.description - Damage description text
 */
const BoundingBox = ({ box, imageDims, index, description }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ placement: 'top', left: 0, maxWidth: 400 });
    const badgeRef = useRef(null);
    const tooltipRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    if (!imageDims.width || !imageDims.height) return null;

    // Convert normalized coordinates (0-1) to pixel coordinates
    const left = box.x * imageDims.width;
    const top = box.y * imageDims.height;
    const width = box.width * imageDims.width;
    const height = box.height * imageDims.height;

    // Calculate tooltip position based on available space within image container
    const calculateTooltipPosition = () => {
        if (!badgeRef.current || !tooltipRef.current) return { placement: 'top', left: 0, maxWidth: 400 };

        const badgeRect = badgeRef.current.getBoundingClientRect();
        
        // Find the image container (the div with aspect ratio that contains the image)
        let container = badgeRef.current;
        let foundContainer = null;
        
        // Traverse up to find the image container div
        while (container && container.parentElement) {
            container = container.parentElement;
            const classes = container.className || '';
            const style = container.getAttribute('style') || '';
            const hasDataAttr = container.getAttribute('data-image-container') === 'true';
            
            // Look for the image container (has data attribute, aspect ratio classes, or contains the image)
            if (hasDataAttr || 
                ((classes.includes('aspect-') || style.includes('aspect')) && 
                 container.querySelector('img'))) {
                foundContainer = container;
                break;
            }
        }

        // If image container not found, try to find carousel container
        if (!foundContainer) {
            container = badgeRef.current;
            while (container && container.parentElement) {
                container = container.parentElement;
                const classes = container.className || '';
                const hasDataAttr = container.getAttribute('data-carousel-container') === 'true';
                
                if (hasDataAttr || classes.includes('lg:col-span-2') || classes.includes('carousel')) {
                    foundContainer = container;
                    break;
                }
            }
        }

        // Fallback to viewport if container not found
        const containerRect = foundContainer 
            ? foundContainer.getBoundingClientRect()
            : {
                left: 0,
                right: window.innerWidth,
                top: 0,
                bottom: window.innerHeight,
                width: window.innerWidth,
                height: window.innerHeight
            };
        
        // Calculate available space relative to container
        const spaceAbove = badgeRect.top - containerRect.top;
        const spaceBelow = containerRect.bottom - badgeRect.bottom;
        const spaceLeft = badgeRect.left - containerRect.left;
        const spaceRight = containerRect.right - badgeRect.right;
        const containerWidth = containerRect.width || (containerRect.right - containerRect.left);

        // Determine vertical placement
        let placement = 'top';
        const minTooltipHeight = 150;
        if (spaceAbove < minTooltipHeight + 20 && spaceBelow > spaceAbove) {
            placement = 'bottom';
        }

        // Calculate optimal tooltip width (respect container width with padding)
        const padding = 20; // Padding from container edges
        const maxAvailableWidth = Math.min(
            containerWidth - padding * 2,
            400 // Max preferred width
        );

        // Calculate horizontal position relative to badge
        // Start centered on badge
        const badgeCenter = 12; // Half of badge width (24px)
        let tooltipLeft = -maxAvailableWidth / 2 + badgeCenter;
        
        // Constrain to container bounds - ensure tooltip stays within image container
        // Calculate where tooltip edges would be
        const tooltipRightEdge = tooltipLeft + maxAvailableWidth;
        const tooltipLeftEdge = tooltipLeft;
        
        // If tooltip would extend beyond right edge, shift left
        if (tooltipRightEdge > spaceRight - padding) {
            tooltipLeft = spaceRight - maxAvailableWidth - padding;
        }
        
        // If tooltip would extend beyond left edge, shift right
        if (tooltipLeftEdge < -spaceLeft + padding) {
            tooltipLeft = -spaceLeft + padding;
        }
        
        // Final clamp to ensure it's within bounds
        const minLeft = -spaceLeft + padding;
        const maxLeft = spaceRight - maxAvailableWidth - padding;
        tooltipLeft = Math.max(minLeft, Math.min(maxLeft, tooltipLeft));

        // Calculate actual max width based on available space from badge position
        const availableFromLeft = spaceLeft + tooltipLeft - padding;
        const availableFromRight = spaceRight - tooltipLeft - padding;
        const actualMaxWidth = Math.min(
            maxAvailableWidth,
            Math.max(availableFromLeft, availableFromRight) * 2 - 40 // Account for padding
        );

        return { 
            placement, 
            left: tooltipLeft, 
            maxWidth: Math.max(200, Math.min(actualMaxWidth, maxAvailableWidth)) // Minimum 200px, max available
        };
    };

    // Update position when hovered (after tooltip is rendered)
    useEffect(() => {
        if (isHovered) {
            // Small delay to ensure tooltip is rendered and measured
            const timeoutId = setTimeout(() => {
                const position = calculateTooltipPosition();
                setTooltipPosition(position);
            }, 10);
            return () => clearTimeout(timeoutId);
        }
    }, [isHovered, imageDims, box]);

    const style = {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '3px solid #ef4444', // red-500
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.7)',
        pointerEvents: 'none', // The box itself shouldn't capture events
        zIndex: isHovered ? 15 : 10, // Increase z-index when hovered to appear above other bounding boxes
    };
    
    const labelContainerStyle = {
        position: 'absolute',
        top: '-1.8rem',
        left: '0',
        pointerEvents: 'auto', // The label should be interactive
    };

    const tooltipStyle = {
        position: 'absolute',
        left: `${tooltipPosition.left}px`,
        [tooltipPosition.placement === 'top' ? 'bottom' : 'top']: '100%',
        marginBottom: tooltipPosition.placement === 'top' ? '0.5rem' : '0',
        marginTop: tooltipPosition.placement === 'bottom' ? '0.5rem' : '0',
        width: `${tooltipPosition.maxWidth}px`,
        maxWidth: `${tooltipPosition.maxWidth}px`,
        minWidth: '200px',
        maxHeight: '300px',
        overflowY: 'auto',
        overflowX: 'hidden',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
    };

    return (
        <div style={style} className="z-10">
            <div 
                className="relative group" 
                style={labelContainerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Number Badge */}
                <span 
                    ref={badgeRef}
                    className="bg-red-500 text-white font-bold text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center w-6 h-6"
                    style={{ textShadow: '1px 1px 1px rgba(0, 0, 0, 0.6)' }}
                >
                    {index + 1}
                </span>

                {/* Tooltip with Description */}
                <div 
                    ref={tooltipRef}
                    style={tooltipStyle}
                    className="bg-gray-900 text-white text-sm rounded-md shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div 
                        style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto',
                            whiteSpace: 'normal',
                        }}
                        className="leading-relaxed"
                    >
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoundingBox;

