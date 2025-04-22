async function isLimitExceeded(currentDate, category, additionalTime) {
    const limitRecord = await UserUsage.findOne({ date: currentDate });
    if (!limitRecord) return false; // No limits set
  
    const limits = limitRecord.categoryLimits || {};
    const usage = limitRecord.catergoryUsage || {};
  
    const currentLimit = limits[category];
    const currentUsage = usage[category] || 0;
  
    // If limit is -1 (unlimited), allow it
    if (currentLimit === -1 || currentLimit === undefined) {
      return false;
    }
  
    // Check if new usage exceeds limit
    return (currentUsage + additionalTime) > currentLimit;
  }
  
  async function isLimitExceededTotalTime(currentDate, additionalTime) {
    const limitRecord = await UserUsage.findOne({ date: currentDate });
    if (!limitRecord) return false; // No limits set
  
  
    // If limit is -1 (unlimited), allow it
  
    if (limitRecord.totalLimiter != -1) {
      console.log("There is not categoryLimit here ");
  
      return limitRecord.totalLimiter < limitRecord.totalUsage;
    }
    return false;
  }