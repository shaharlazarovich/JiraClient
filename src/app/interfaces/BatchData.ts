interface BatchData {
    type: 'issues' | 'histories';
    items: BatchItem[];
    totalProcessed: number;
    batchNumber: number;
    startTime?: Date;  // Add these
    endTime?: Date;    // timing fields
  }