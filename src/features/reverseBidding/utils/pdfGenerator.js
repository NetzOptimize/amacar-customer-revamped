import jsPDF from 'jspdf';

/**
 * Generates a CarMax-style offer certificate PDF
 * @param {Object} data - Certificate data
 * @param {string} data.certificateType - 'online' or 'appraisal'
 * @param {string} data.verificationCode - Verification code
 * @param {string} data.vehicleYear - Vehicle year
 * @param {string} data.vehicleMake - Vehicle make
 * @param {string} data.vehicleModel - Vehicle model
 * @param {string} data.vehicleTrim - Vehicle trim
 * @param {string} data.vin - Vehicle VIN
 * @param {string} data.mileage - Vehicle mileage
 * @param {number} data.offerAmount - Offer amount
 * @param {string} data.validUntil - Offer valid until date
 * @param {string} data.storeName - Store name
 * @param {string} data.storeAddress - Store address
 * @param {string} data.storeCity - Store city
 * @param {string} data.storePhone - Store phone
 * @param {string} data.contactName - Contact name (appraisal only)
 * @param {string} data.appraisalDate - Appraisal date (appraisal only)
 * @param {string} data.appraisalNumber - Appraisal number (appraisal only)
 * @param {Array} data.features - Array of vehicle features (appraisal only)
 * @param {Object} data.conditions - Vehicle conditions (appraisal only)
 * @param {number} data.taxSavings - Potential tax savings (appraisal only)
 */
export function generateCertificatePDF(data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Amacar brand colors
  const primaryOrange = [255, 107, 44]; // #FF6B2C
  const darkNavy = [26, 35, 53]; // #1A2335
  const lightCream = [252, 248, 240];
  const lightGray = [245, 245, 245];
  const darkGray = [51, 51, 51];
  const mediumGray = [180, 180, 180];

  if (data.certificateType === 'online') {
    generateOnlineOffer(doc, data, pageWidth, pageHeight, darkNavy, primaryOrange, lightGray, mediumGray, darkGray);
  } else {
    generateAppraisalOffer(doc, data, pageWidth, pageHeight, darkNavy, primaryOrange, lightGray, mediumGray, darkGray);
  }

  return doc;
}

function generateOnlineOffer(doc, data, pageWidth, pageHeight, darkNavy, carmaxYellow, lightGray, mediumGray, darkGray) {
  // Header - Dark Navy background
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // CarMax logo area (simplified - you can add actual logo)
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 22, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('CM', 25, 24, { align: 'center' });

  // "CarMax" text
  doc.setFontSize(16);
  doc.setTextColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.text('car', 37, 20);
  doc.setTextColor(255, 255, 255);
  doc.text('max', 50, 20);

  // "Online Offer" text
  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Online Offer', 37, 32);

  // Verification Code section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Verification Code', 20, 58);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.verificationCode || 'ED7B5W5T', 20, 66);

  // Offer Amount section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Offer Amount*', 20, 78);

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 150, 0);
  doc.text(`$${data.offerAmount?.toLocaleString() || '13,000'}`, 20, 90);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('This offer is good for 7 days.', 20, 96);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Offer valid until: ${data.validUntil || 'Saturday, November 5th, 2022'}`, 20, 101);

  // Your Local CarMax section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Local CarMax', 20, 112);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.storeName || 'LAX', 20, 118);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(data.storeAddress || '8811 La Cienega Boulevard', 20, 124);
  doc.text(`${data.storeCity || 'Los Angeles, CA 90301'}`, 20, 129);
  
  doc.setTextColor(0, 100, 200);
  doc.textWithLink(data.storePhone || '(310) 568-5272', 20, 134, { url: `tel:${data.storePhone || '3105685272'}` });
  
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text('See carmax.com for store hours.', 20, 139);

  // Vehicle Information section (right side)
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Vehicle Information', 110, 58);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const vehicleInfo = `${data.vehicleYear || '2015'} ${data.vehicleMake || 'Audi'} ${data.vehicleModel || 'A3'} ${data.vehicleTrim || 'Premium'}`;
  doc.text(vehicleInfo, 110, 65);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`VIN: ${data.vin || 'WAUAGCFF3F1008778'}`, 110, 71);
  doc.text(`Mileage: ${data.mileage || '58000'}`, 110, 76);

  // Vehicle condition table
  const conditions = [
    'Accidents',
    'Flood/Frame Damage',
    'Mechanical',
    'Exterior',
    'Interior',
    'Tires',
    'Keys',
    'Modifications',
    'Other',
    'Additional Equipment'
  ];

  const values = [
    'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
    data.keys || '2 or more',
    'N/A', 'N/A',
    data.additionalEquipment || '9 items noted'
  ];

  let yPos = 88;
  doc.setFontSize(8);
  conditions.forEach((condition, index) => {
    doc.setTextColor(100, 100, 100);
    doc.text(condition, 110, yPos);
    doc.setTextColor(80, 80, 80);
    doc.text(values[index], 160, yPos);
    yPos += 5;
  });

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 150, pageWidth - 20, 150);

  // Disclaimer text
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'Print this certificate to redeem this offer at your local CarMax.';
  doc.text(disclaimer, pageWidth / 2, 158, { align: 'center' });

  const disclaimerText = '* The offer from CarMax is contingent on your providing accurate information. CarMax will conduct an in-person verification of your vehicle and evaluate other vehicle use and history information prior to finalizing the offer. Any differences between the information you provide about your vehicle and the vehicle\'s actual condition, use, and history may impact the offer you receive from CarMax.';
  
  doc.setFontSize(6.5);
  const lines = doc.splitTextToSize(disclaimerText, pageWidth - 40);
  doc.text(lines, 20, 165);

  // Yellow box at bottom
  doc.setFillColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.rect(20, 195, 115, 45, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Bring these items to sell us your vehicle', 25, 203);

  const items = [
    'Valid, state-issued ID for all titleholders',
    'Valid, current vehicle registration',
    'All keys, fobs and remotes',
    'Car title or payoff information (All titleholders should be present)',
    'Payoff information (if applicable):'
  ];

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let itemY = 210;
  items.forEach(item => {
    doc.text('•', 27, itemY);
    doc.text(item, 32, itemY);
    itemY += 5;
  });

  doc.setFontSize(7);
  doc.text('Bring your account number and lender phone number.', 37, 233);
  doc.text('Have a co-signer? Their signature is needed to sell your car.', 37, 237);

  // QR code section (navy box)
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(140, 195, 50, 45, 'F');

  // QR code placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(145, 200, 35, 35, 'F');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('QR CODE', 162.5, 220, { align: 'center' });

  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text('Scan this QR code to', 162.5, 238, { align: 'center' });
  doc.text('start your 7-Day Money-', 162.5, 241, { align: 'center' });
  doc.text('Back Guarantee™.', 162.5, 244, { align: 'center' });
}

function generateAppraisalOffer(doc, data, pageWidth, pageHeight, darkNavy, primaryOrange, lightGray, mediumGray, darkGray) {
  // Premium cream background
  const lightCream = [252, 248, 240];
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Elegant border frame - double line
  doc.setDrawColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setLineWidth(1.2);
  doc.rect(12, 8, pageWidth - 24, pageHeight - 16, 'S');
  
  doc.setLineWidth(0.4);
  doc.rect(15, 11, pageWidth - 30, pageHeight - 22, 'S');

  // Orange decorative line at top
  doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.setLineWidth(0.8);
  doc.line(20, 20, pageWidth - 20, 20);

  // Main Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Competitive Dealer Offer Certificate', pageWidth / 2, 32, { align: 'center' });

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const subtitleText = 'This certificate summarizes the competitive offer submitted by a participating dealership through the reverse-bidding process.';
  const subtitleLines = doc.splitTextToSize(subtitleText, pageWidth - 60);
  let subtitleY = 40;
  subtitleLines.forEach((line, index) => {
    doc.text(line, pageWidth / 2, subtitleY + (index * 5), { align: 'center' });
  });
  subtitleY += subtitleLines.length * 5;

  // Orange decorative line
  doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 50, subtitleY + 5, pageWidth / 2 + 50, subtitleY + 5);

  let currentY = subtitleY + 15;

  // Vehicle Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Vehicle Information', 20, currentY);
  currentY += 8;

  const vehicleName = data.vehicleTrim 
    ? `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel} ${data.vehicleTrim}`.trim()
    : `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`.trim() || data.vehicleDescription || 'Vehicle Information';

  // Get market value and savings
  const marketValue = data.marketValue || data.onlineMarketValue || 0;
  const finalPrice = data.offerAmount || 0;
  const totalSavings = marketValue > 0 && finalPrice > 0 ? marketValue - finalPrice : 0;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  
  // Vehicle Name
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(vehicleName, 50, currentY);
  currentY += 6;

  // VIN
  if (data.vin) {
    doc.setFont('helvetica', 'bold');
    doc.text('VIN #:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.vin, 50, currentY);
    currentY += 6;
  }

  // Stock
  if (data.stock) {
    doc.setFont('helvetica', 'bold');
    doc.text('Stock:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.stock, 50, currentY);
    currentY += 6;
  }

  // Online Market Value
  if (marketValue > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Online Market Value:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`$${marketValue.toLocaleString()}`, 70, currentY);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    currentY += 6;
  }

  // Total Savings
  if (totalSavings > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Total Savings:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
    doc.text(`$${totalSavings.toLocaleString()}`, 70, currentY);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    currentY += 6;
  }

  // Dealer Competitive Sales Price
  if (finalPrice > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Dealer Competitive Sales Price:', 20, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
    doc.text(`$${finalPrice.toLocaleString()}`, 90, currentY);
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    currentY += 10;
  }

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 8;

  // Customer Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Customer Information', 20, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  if (data.customerName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Full Name:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.customerName, 50, currentY);
    currentY += 6;
  }

  if (data.customerAddress) {
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(data.customerAddress, pageWidth - 70);
    addressLines.forEach((line, index) => {
      doc.text(line, 50, currentY + (index * 5));
    });
    currentY += addressLines.length * 5 + 2;
  }

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 8;

  // Dealer Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Dealer Information', 20, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  // Point of Contact
  if (data.contactName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Point of Contact:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.contactName, 60, currentY);
    currentY += 6;
  }

  // Email
  if (data.dealerEmail) {
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.dealerEmail, 50, currentY);
    currentY += 6;
  }

  // Phone
  if (data.contactPhone || data.storePhone) {
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(data.contactPhone || data.storePhone, 50, currentY);
    currentY += 6;
  }

  // Center-aligned Appraisal Offer Section (Highlighted)
  const offerSectionY = currentY + 15;
  
  // Orange background box for offer (highlighted section)
  doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.roundedRect(20, offerSectionY - 10, pageWidth - 40, 50, 3, 3, 'FD');
  
  // White text on orange background
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Competitive Dealer Offer', pageWidth / 2, offerSectionY, { align: 'center' });

  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${finalPrice.toLocaleString() || '0'}`, pageWidth / 2, offerSectionY + 15, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`This offer is valid until the close of business on ${data.validUntil || 'N/A'}.`, pageWidth / 2, offerSectionY + 25, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('This offer is good for 7 days', pageWidth / 2, offerSectionY + 32, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('and will be honored at all participating dealerships.', pageWidth / 2, offerSectionY + 37, { align: 'center' });
  doc.text('After 7 days, your vehicle will need to be reappraised and the ', pageWidth / 2, offerSectionY + 42, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text('offer may change.', pageWidth / 2, offerSectionY + 47, { align: 'center' });

  // Bottom section - Certificate Number, Date, and Amacar Logo
  const bottomSectionY = pageHeight - 50;
  const leftX = 20;
  const centerX = pageWidth / 2;
  const rightX = pageWidth - 20;

  // Left column - Certificate Number
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('CERTIFICATE NUMBER', leftX, bottomSectionY, { align: 'left' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(data.verificationCode || 'N/A', leftX, bottomSectionY + 3.5, { align: 'left' });

  // Center column - Amacar Logo
  doc.setDrawColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setLineWidth(2);
  doc.circle(centerX, bottomSectionY + 5, 12, 'S');
  doc.setLineWidth(0.5);
  doc.circle(centerX, bottomSectionY + 5, 10, 'S');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('AMACAR', centerX, bottomSectionY + 2, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('CERTIFIED', centerX, bottomSectionY + 6, { align: 'center' });
  doc.text('AUCTION', centerX, bottomSectionY + 9.5, { align: 'center' });

  // Right column - Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('DATE', rightX, bottomSectionY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const dateStr = data.appraisalDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(dateStr, rightX, bottomSectionY + 3.5, { align: 'right' });

  // Footer disclaimer box
  const disclaimerY = bottomSectionY + 20;
  const disclaimerHeight = 20;
  
  // Position disclaimer box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(20, disclaimerY, pageWidth - 40, disclaimerHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  
  const maxDisclaimerWidth = pageWidth - 50;
  let disclaimerTextY = disclaimerY + 4;
  const lineHeight = 2.5;
  
  // Disclaimer text
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
        doc.text(line, pageWidth / 2, disclaimerTextY, { align: 'center' });
        disclaimerTextY += lineHeight;
      });
      doc.setFont('helvetica', 'normal');
    } else {
      const lines = doc.splitTextToSize(text, maxDisclaimerWidth);
      lines.forEach(line => {
        doc.text(line, pageWidth / 2, disclaimerTextY, { align: 'center' });
        disclaimerTextY += lineHeight;
      });
    }
  });
}

// Helper function to map session data to certificate format
export function mapSessionToCertificateData(session, userData = null) {
  const vehicle = session.certificateData?.vehicle || session.car || {};
  const acceptedBid = session.acceptedBid || {};
  const dealer = session.certificateData?.dealer || {};
  
  // Get customer info
  const customer = session.certificateData?.customer || {};
  const customerName = customer.name || 
                      userData?.display_name ||
                      userData?.name ||
                      (customer.first_name && customer.last_name 
                        ? `${customer.first_name} ${customer.last_name}` 
                        : '') ||
                      (userData?.first_name && userData?.last_name
                        ? `${userData.first_name} ${userData.last_name}`
                        : '') ||
                      customer.display_name || 
                      userData?.user?.display_name ||
                      '';
  
  const customerAddress = customer.address || 
                         userData?.address ||
                         (customer.address_1 
                          ? `${customer.address_1}${customer.address_2 ? ', ' + customer.address_2 : ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.postcode || ''}`.trim()
                          : '') ||
                         (userData?.billing_address_1
                          ? `${userData.billing_address_1}${userData.billing_address_2 ? ', ' + userData.billing_address_2 : ''}, ${userData.billing_city || ''}, ${userData.billing_state || ''} ${userData.billing_postcode || ''}`.trim()
                          : '') ||
                         (userData?.address_1
                          ? `${userData.address_1}${userData.address_2 ? ', ' + userData.address_2 : ''}, ${userData.city || ''}, ${userData.state || ''} ${userData.postcode || ''}`.trim()
                          : '');

  // Calculate valid until date (7 days from now)
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 7);
  const validUntil = validUntilDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get market value and final price
  const marketValue = session.certificateData?.marketValue || 
                     session.certificateData?.onlineMarketValue ||
                     session.criteria?.price ||
                     session.car?.price ||
                     0;
  const finalPrice = session.certificateData?.bid_amount || 
                    acceptedBid.currentOffer || 
                    acceptedBid.amount || 
                    0;

  // Generate verification code from session ID
  const verificationCode = session.id ? `RB-${String(session.id).padStart(6, '0')}` : `AMC-${Date.now().toString().slice(-8)}`;

  // Get dealer email
  const dealerEmail = dealer.email ||
                     acceptedBid.dealerEmail || 
                     acceptedBid.dealer_email ||
                     '';

  return {
    certificateType: 'appraisal', // Use appraisal format for reverse bidding
    verificationCode: verificationCode,
    vehicleYear: vehicle.year || '',
    vehicleMake: vehicle.make || '',
    vehicleModel: vehicle.model || '',
    vehicleTrim: vehicle.trim || vehicle.title?.replace(`${vehicle.year} ${vehicle.make} ${vehicle.model}`, '').trim() || '',
    vehicleDescription: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim() || 'Vehicle Information',
    vin: vehicle.vin || session.certificateData?.vin || session.car?.vin || '',
    stock: vehicle.stock || vehicle.stock_number || vehicle.stockNumber || vehicle.sku || session.certificateData?.stock || '',
    mileage: vehicle.mileage || session.certificateData?.mileage || '',
    color: vehicle.color || '',
    offerAmount: finalPrice,
    marketValue: marketValue,
    onlineMarketValue: marketValue,
    validUntil: validUntil,
    storeName: dealer.name || acceptedBid.dealerName || 'Authorized Dealer',
    storeAddress: dealer.address || acceptedBid.dealerLocation || '',
    storeCity: vehicle.city || session.certificateData?.vehicle?.city || '',
    storePhone: dealer.phone || acceptedBid.dealer_phone || acceptedBid.phone || '',
    contactName: dealer.name || acceptedBid.dealerName || acceptedBid.salesManager || 'Sales Manager',
    contactPhone: dealer.phone || acceptedBid.dealer_phone || acceptedBid.phone || '',
    dealerEmail: dealerEmail,
    appraisalDate: session.certificateData?.date || 
                   acceptedBid.acceptedDate || 
                   session.date_created || 
                   session.created_at ||
                   new Date().toLocaleDateString('en-US', { 
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   }),
    appraisalNumber: session.id ? String(session.id) : '',
    customerName: customerName,
    customerAddress: customerAddress,
    features: vehicle.features || [],
    conditions: vehicle.conditions || {},
    taxSavings: 0,
    comments: 'THANKS FOR USING AMACAR REVERSE BIDDING',
    keys: '2 or more',
    additionalEquipment: 'Standard equipment included'
  };
}

// Example usage function
export function downloadCertificate(data) {
  const doc = generateCertificatePDF(data);
  doc.save(`amacar_${data.certificateType}_offer_${data.verificationCode || Date.now()}.pdf`);
}

// Wrapper function for backward compatibility
export async function generateCertificatePDFFromSession(session, userData = null) {
  try {
    const certificateData = mapSessionToCertificateData(session, userData);
    const doc = generateCertificatePDF(certificateData);
    doc.save(`Amacar_Certificate_${session.id || 'AMC-2025-001234'}.pdf`);
    return true;
  } catch (e) {
    console.error('Certificate generation failed:', e);
    return false;
  }
}

// Export for direct use
export default generateCertificatePDF;