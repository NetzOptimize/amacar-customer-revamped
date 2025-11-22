export async function generateCertificatePDF(session) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Amacar brand colors
        const primaryOrange = [255, 107, 44]; // #FF6B2C
        const darkNavy = [26, 35, 53]; // #1A2335
        const lightCream = [252, 248, 240];
        const darkGray = [51, 51, 51];
        const lightGray = [245, 245, 245];

        // Premium cream background
        doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Elegant border frame - double line (reduced top/bottom margins)
        doc.setDrawColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.setLineWidth(1.2);
        doc.rect(12, 8, pageWidth - 24, pageHeight - 16, 'S');
        
        doc.setLineWidth(0.4);
        doc.rect(15, 11, pageWidth - 30, pageHeight - 22, 'S');

        // Orange decorative line at top (moved up)
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(0.8);
        doc.line(40, 15, pageWidth - 40, 15);

        // Certificate Header (moved up)
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('OFFICIAL CERTIFICATE OF PURCHASE', pageWidth / 2, 22, { align: 'center' });

        // Main Title - CERTIFICATE (moved up)
        doc.setFontSize(36);
        doc.setFont('times', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('CERTIFICATE', pageWidth / 2, 35, { align: 'center' });

        // Subtitle
        doc.setFontSize(11);
        doc.setFont('times', 'italic');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('of Vehicle Purchase Agreement', pageWidth / 2, 42, { align: 'center' });

        // Orange decorative line
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 50, 49, pageWidth / 2 + 50, 49);

        // "This is to certify that" text (moved up)
        doc.setFontSize(9.5);
        doc.setFont('times', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('This is to certify that a reverse auction has been successfully completed for', pageWidth / 2, 56, { align: 'center' });

        // Vehicle Information - Featured prominently
        const vehicle = session.certificateData?.vehicle || session.car || {};
        const vehicleInfo = vehicle.year && vehicle.make && vehicle.model
            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
            : (vehicle.title || 'Vehicle Information');
        const vehicleTrim = vehicle.title ? vehicle.title.replace(`${vehicle.year} ${vehicle.make} ${vehicle.model}`, '').trim() : '';
        const vehicleColor = vehicle.color || '';
        const vehicleDetails = [vehicleTrim, vehicleColor].filter(Boolean).join(' • ') || '';
        
        doc.setFontSize(15);
        doc.setFont('times', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text(vehicleInfo, pageWidth / 2, 63, { align: 'center' });
        
        if (vehicleDetails) {
            doc.setFontSize(9.5);
            doc.setFont('times', 'italic');
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(vehicleDetails, pageWidth / 2, 70, { align: 'center' });
        }

        // Winning bid amount - Large and centered
        const finalPrice = session.certificateData?.bid_amount || 
                          session.acceptedBid?.currentOffer || 
                          session.acceptedBid?.amount || 
                          0;
        let currentY = vehicleDetails ? 90 : 77;
        
        if (finalPrice > 0) {
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text('Final Agreed Purchase Price', pageWidth / 2, currentY - 15, { align: 'center' });
            
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
            doc.text(`$${finalPrice.toLocaleString()}`, pageWidth / 2, currentY - 5, { align: 'center' });

            // Orange decorative line
            doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
            doc.setLineWidth(0.5);
            doc.line(pageWidth / 2 - 50, currentY , pageWidth / 2 + 50, currentY );
            currentY += 17;
        }

        // Authorized dealer section - more compact
        const dealerY = currentY -8 ;
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('Authorized Dealer', pageWidth / 2, dealerY, { align: 'center' });

        const dealerName = session.certificateData?.dealer?.name || 
                          session.acceptedBid?.dealerName || 
                          'Authorized Dealer';
        const dealerLocation = (session.certificateData?.vehicle?.city && session.certificateData?.vehicle?.state 
                                ? `${session.certificateData.vehicle.city}, ${session.certificateData.vehicle.state}`
                                : '') ||
                              session.acceptedBid?.dealerLocation || 
                              '';
        
        doc.setFontSize(11);
        doc.setFont('times', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text(dealerName, pageWidth / 2, dealerY + 5, { align: 'center' });
        
        currentY = dealerY + 5;
        if (dealerLocation) {
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(dealerLocation, pageWidth / 2, currentY + 4, { align: 'center' });
            currentY += 4;
        }

        // Compact three-column layout at bottom - moved to bottom to save space
        const bottomSectionY = currentY + 12; // Position right after dealer section
        const leftX = 40;
        const centerX = pageWidth / 2;
        const rightX = pageWidth - 40;
        
        // Left column - Certificate Number and Date
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('CERTIFICATE NUMBER', leftX, bottomSectionY, { align: 'left' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const certNumber = session.id ? `RB-${String(session.id).padStart(6, '0')}` : 'N/A';
        doc.text(certNumber, leftX, bottomSectionY + 3.5, { align: 'left' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('DATE ISSUED', leftX, bottomSectionY + 7, { align: 'left' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        const dateStr = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(dateStr, leftX, bottomSectionY + 10.5, { align: 'left' });
        
        // Signature line (left)
        doc.setDrawColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setLineWidth(0.3);
        doc.line(leftX, bottomSectionY + 15, leftX + 50, bottomSectionY + 15);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('Authorized by Amacar Platform', leftX + 25, bottomSectionY + 19, { align: 'center' });
        
        // Center column - Official seal
        doc.setDrawColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.setLineWidth(2);
        doc.circle(centerX, bottomSectionY + 8, 16, 'S');
        doc.setLineWidth(0.5);
        doc.circle(centerX, bottomSectionY + 8, 14, 'S');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('AMACAR', centerX, bottomSectionY + 5, { align: 'center' });
        doc.setFontSize(6.5);
        doc.text('CERTIFIED', centerX, bottomSectionY + 10, { align: 'center' });
        doc.text('AUCTION', centerX, bottomSectionY + 14.5, { align: 'center' });
        
        // Right column - Dealer Contact
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('DEALER CONTACT', rightX, bottomSectionY, { align: 'right' });
        
        const dealerPhone = session.certificateData?.dealer?.phone ||
                           session.acceptedBid?.dealer_phone ||
                           session.acceptedBid?.phone ||
                           '';
        const dealerEmail = session.certificateData?.dealer?.email ||
                          session.acceptedBid?.dealerEmail || 
                          session.acceptedBid?.dealer_email ||
                          '';
        
        let contactY = bottomSectionY + 3.5;
        if (dealerPhone) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(dealerPhone, rightX, contactY, { align: 'right' });
            contactY += 3.5;
        }
        if (dealerEmail) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(dealerEmail, rightX, contactY, { align: 'right' });
            contactY += 3.5;
        }
        
        // Date line (right)
        doc.setDrawColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.setLineWidth(0.3);
        doc.line(rightX - 50, bottomSectionY + 15, rightX, bottomSectionY + 15);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Date of Certification', rightX - 25, bottomSectionY + 19, { align: 'center' });

        // Footer disclaimer box - positioned right after bottom section
        const disclaimerY = bottomSectionY + 40;
        const disclaimerHeight = 30;
        
        // Position disclaimer box to align with inner border (15mm from edge)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.roundedRect(25, disclaimerY, pageWidth - 50, disclaimerHeight, 2, 2, 'FD');

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('DISCLOSURE & IMPORTANT NOTES', pageWidth / 2, disclaimerY + 3.5, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.3);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        const maxDisclaimerWidth = pageWidth - 60;
        let disclaimerTextY = disclaimerY + 6.5;
        const lineHeight = 2.3;
        
        // Client's exact disclaimer text - more compact
        const disclaimerTexts = [
            'This certificate reflects the best bid received from participating dealerships during the reverse-bidding session.',
            '',
            'It does not guarantee:',
            '• Bottom-line or "Out-The-Door" pricing',
            '• Taxes, registration, DMV, or documentation fees',
            '• Any additional dealer products or services',
            '',
            'Dealerships may offer optional items such as extended warranties, GAP, and maintenance packages.',
            '',
            'Amacar does not sell vehicles or set prices; it only facilitates competitive bidding. Final pricing, financing, and vehicle availability are determined exclusively between the customer and the selected dealership.'
        ];
        
        disclaimerTexts.forEach(text => {
            if (text === '') {
                disclaimerTextY += 1.2;
            } else if (text === 'It does not guarantee:') {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5.5);
                const lines = doc.splitTextToSize(text, maxDisclaimerWidth);
                lines.forEach(line => {
                    doc.text(line, pageWidth / 2, disclaimerTextY, { align: 'center' });
                    disclaimerTextY += lineHeight;
                });
                doc.setFont('helvetica', 'normal');
            } else if (text.startsWith('•')) {
                doc.text(text, 32, disclaimerTextY, { align: 'left' });
                disclaimerTextY += lineHeight;
            } else {
                const lines = doc.splitTextToSize(text, maxDisclaimerWidth);
                lines.forEach(line => {
                    doc.text(line, pageWidth / 2, disclaimerTextY, { align: 'center' });
                    disclaimerTextY += lineHeight;
                });
            }
        });

        // Footer with tagline - positioned just above bottom border
        doc.setFontSize(6.5);
        doc.setFont('times', 'italic');
        doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.text('Amacar - Revolutionizing the Future of Automotive Sales', pageWidth / 2, pageHeight - 15, { align: 'center' });

        // Elegant corner ornaments - Orange theme (adjusted for new border positions)
        const ornamentSize = 10;
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(1);
        
        // Top left (moved up)
        doc.line(18, 14, 18 + ornamentSize, 14);
        doc.line(18, 14, 18, 14 + ornamentSize);
        // Top right (moved up)
        doc.line(pageWidth - 18, 14, pageWidth - 18 - ornamentSize, 14);
        doc.line(pageWidth - 18, 14, pageWidth - 18, 14 + ornamentSize);
        // Bottom left (moved down)
        doc.line(18, pageHeight - 14, 18 + ornamentSize, pageHeight - 14);
        doc.line(18, pageHeight - 14, 18, pageHeight - 14 - ornamentSize);
        // Bottom right (moved down)
        doc.line(pageWidth - 18, pageHeight - 14, pageWidth - 18 - ornamentSize, pageHeight - 14);
        doc.line(pageWidth - 18, pageHeight - 14, pageWidth - 18, pageHeight - 14 - ornamentSize);

        // Save the PDF
        doc.save(`Amacar_Certificate_${session.id || 'AMC-2025-001234'}.pdf`);
        return true;
    } catch (e) {
        console.error('Certificate generation failed:', e);
        return false;
    }
}