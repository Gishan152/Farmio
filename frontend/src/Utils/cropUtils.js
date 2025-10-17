// API utility functions for crop/product data

/**
 * Fetch all crops from order service
 */
export const fetchAllCrops = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/order/get-crops', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crops:', error);
    throw error;
  }
};

/**
 * Create a lookup map of cropId -> crop object (full crop data)
 */
export const createCropLookupMap = (crops) => {
  const lookupMap = {};
  crops.forEach(crop => {
    lookupMap[crop.id] = crop; // Store full crop object, not just the name
  });
  return lookupMap;
};

/**
 * Get product names from order items using crop lookup
 */
export const getProductNamesFromOrder = (orderItems, cropLookupMap) => {
  if (!orderItems || orderItems.length === 0) {
    return 'No items';
  }

  const productNames = orderItems.map(item => {
    const crop = cropLookupMap[item.cropId];
    return crop?.type || `Crop #${item.cropId}`;
  });

  // Return first product name if single item, or "Multiple items" if more than one
  if (productNames.length === 1) {
    return productNames[0];
  } else if (productNames.length > 1) {
    return `${productNames[0]} (+${productNames.length - 1} more)`;
  }
  
  return 'Unknown';
};

/**
 * Get farm name from order items using crop lookup
 */
export const getFarmNameFromOrder = (orderItems, cropLookupMap) => {
  if (!orderItems || orderItems.length === 0) {
    return 'Unknown Farm';
  }

  // Get farm name from the first item
  const firstItem = orderItems[0];
  const crop = cropLookupMap[firstItem.cropId];
  return crop?.farm || 'Unknown Farm';
};

/**
 * Get farmer details from order items using crop lookup
 */
export const getFarmerDetailsFromOrder = (orderItems, cropLookupMap) => {
  if (!orderItems || orderItems.length === 0) {
    return null;
  }

  // Get farmer details from the first item
  const firstItem = orderItems[0];
  const crop = cropLookupMap[firstItem.cropId];
  
  if (!crop) return null;
  
  return {
    farmerId: crop.farmerId,
    farmName: crop.farm,
    location: crop.location,
    rating: crop.rating,
    verified: crop.verified,
    transportationAvailable: crop.transportationAvailable,
    returnsAccepted: crop.returnsAccepted,
    badges: crop.badges || []
  };
};

/**
 * Get detailed product info for order items
 */
export const getProductDetailsFromOrder = (orderItems, cropLookupMap) => {
  if (!orderItems || orderItems.length === 0) {
    return [];
  }

  return orderItems.map(item => ({
    cropId: item.cropId,
    productName: cropLookupMap[item.cropId] || `Crop #${item.cropId}`,
    quantity: item.quantity,
    unitMeasurement: item.unitMeasurement,
    pricePerUnit: item.pricePerUnit,
    total: item.quantity * item.pricePerUnit
  }));
};

/**
 * Get detailed crop information for order items (includes all crop properties)
 */
export const getDetailedCropInfoFromOrder = (orderItems, crops) => {
  if (!orderItems || orderItems.length === 0 || !crops) {
    return [];
  }

  return orderItems.map(item => {
    const cropInfo = crops.find(crop => crop.id === item.cropId);
    return {
      ...item,
      cropInfo: cropInfo || null,
      productName: cropInfo?.type || `Crop #${item.cropId}`,
      farm: cropInfo?.farm || 'Unknown Farm',
      location: cropInfo?.location || 'Unknown Location',
      rating: cropInfo?.rating || 0,
      verified: cropInfo?.verified || false,
      imageUrl: cropInfo?.imageUrl || null,
      badges: cropInfo?.badges || [],
      transportationAvailable: cropInfo?.transportationAvailable || false,
      returnsAccepted: cropInfo?.returnsAccepted || false,
      total: item.quantity * item.pricePerUnit
    };
  });
};
