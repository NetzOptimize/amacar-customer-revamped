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

        // Elegant border frame - double line (consistent margins)
        doc.setDrawColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.setLineWidth(1.2);
        doc.rect(12, 8, pageWidth - 24, pageHeight - 16, 'S');
        
        doc.setLineWidth(0.4);
        doc.rect(15, 11, pageWidth - 30, pageHeight - 22, 'S');

        // Orange decorative line at top
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(0.8);
        doc.line(40, 18, pageWidth - 40, 18);

        // Certificate Header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('OFFICIAL CERTIFICATE OF PURCHASE', pageWidth / 2, 25, { align: 'center' });

        // Main Title - CERTIFICATE
        doc.setFontSize(36);
        doc.setFont('times', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('CERTIFICATE', pageWidth / 2, 38, { align: 'center' });

        // Subtitle
        doc.setFontSize(11);
        doc.setFont('times', 'italic');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('of Vehicle Purchase Agreement', pageWidth / 2, 45, { align: 'center' });

        // Orange decorative line
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 50, 52, pageWidth / 2 + 50, 52);

        // "This is to certify that" text
        doc.setFontSize(9.5);
        doc.setFont('times', 'normal');
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text('This is to certify that a reverse auction has been successfully completed for', pageWidth / 2, 59, { align: 'center' });

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
        doc.text(vehicleInfo, pageWidth / 2, 66, { align: 'center' });
        
        if (vehicleDetails) {
            doc.setFontSize(9.5);
            doc.setFont('times', 'italic');
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(vehicleDetails, pageWidth / 2, 73, { align: 'center' });
        }

        // Winning bid amount - Large and centered (consistent spacing: 8mm after vehicle)
        const finalPrice = session.certificateData?.bid_amount || 
                          session.acceptedBid?.currentOffer || 
                          session.acceptedBid?.amount || 
                          0;
        let currentY = vehicleDetails ? 88 : 81;
        
        if (finalPrice > 0) {
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text('Final Agreed Purchase Price', pageWidth / 2, currentY, { align: 'center' });
            
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
            doc.text(`$${finalPrice.toLocaleString()}`, pageWidth / 2, currentY + 10, { align: 'center' });

            // Orange decorative line
            doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
            doc.setLineWidth(0.5);
            doc.line(pageWidth / 2 - 50, currentY + 15, pageWidth / 2 + 50, currentY + 15);
            currentY += 22;
        }

        // Authorized dealer section (consistent spacing: 8mm after price)
        const dealerY = currentY + 8;
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
        doc.text(dealerName, pageWidth / 2, dealerY + 6, { align: 'center' });
        
        currentY = dealerY + 6;
        if (dealerLocation) {
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.text(dealerLocation, pageWidth / 2, currentY + 5, { align: 'center' });
            currentY += 5;
        }

        // Simplified bottom section - Certificate Number, Date, Dealer Contact, and Amacar Logo (consistent spacing: 10mm after dealer)
        const bottomSectionY = currentY + 20;
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
        doc.text('DATE', leftX, bottomSectionY + 7, { align: 'left' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        // Use date from certificate data, session, or current date
        const certificateDate = session.certificateData?.date || 
                                session.acceptedBid?.acceptedDate || 
                                session.date_created || 
                                session.created_at ||
                                null;
        const dateToUse = certificateDate ? new Date(certificateDate) : new Date();
        const dateStr = dateToUse.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(dateStr, leftX, bottomSectionY + 10.5, { align: 'left' });
        
        // Center column - Amacar Logo
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
        
        // Right column - Dealer Point of Contact
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

        // Footer disclaimer box - positioned right after bottom section with consistent spacing (8mm gap)
        // Calculate to minimize bottom space - ensure disclaimer ends near page bottom (accounting for 11mm bottom margin)
        const maxDisclosureY = pageHeight + 10; // Leave 5mm padding at bottom
        const disclaimerHeight = 15;
        const disclaimerY = Math.min(bottomSectionY + 30, maxDisclosureY - disclaimerHeight);
        
        // Position disclaimer box to align with inner border (15mm from edge)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.roundedRect(25, disclaimerY, pageWidth - 50, disclaimerHeight, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        const maxDisclaimerWidth = pageWidth - 60;
        let disclaimerTextY = disclaimerY + 4;
        const lineHeight = 2.5;
        
        // Client's refined disclaimer text
        const disclaimerTexts = [
            'This certificate reflects the competitive offer submitted by the selected dealership during the reverse-bidding process and represents the vehicle\'s sales price only. Taxes, government fees, dealer documentation fees, and optional add-ons are not included and may apply at the dealership. Amacar.ai only facilitates the competitive bidding process and does not set, control, or guarantee final pricing or "out-the-door" totals.',
            '',
            'Note: If you are purchasing with cash, financing, or leasing, this amount will serve as your sales price, subject to vehicle availability at the time of purchase.'
        ];
        
        disclaimerTexts.forEach(text => {
            if (text === '') {
                disclaimerTextY += 1.5;
            } else if (text.startsWith('Note:')) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5.7);
                const lines = doc.splitTextToSize(text, maxDisclaimerWidth);
                lines.forEach(line => {
                    doc.text(line, pageWidth / 2, disclaimerTextY , { align: 'center' });
                    disclaimerTextY += lineHeight;
                });
                doc.setFont('helvetica', 'normal');
            } else {
                const lines = doc.splitTextToSize(text, maxDisclaimerWidth);
                lines.forEach(line => {
                    doc.text(line, pageWidth / 2, disclaimerTextY , { align: 'center' });
                    disclaimerTextY += lineHeight;
                });
            }
        });


        // Save the PDF
        doc.save(`Amacar_Certificate_${session.id || 'AMC-2025-001234'}.pdf`);
        return true;
    } catch (e) {
        console.error('Certificate generation failed:', e);
        return false;
    }
}