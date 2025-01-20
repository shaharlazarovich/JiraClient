interface BatchData {
    type: 'issues' | 'histories'| 'users';
    items: BatchItem[];
    totalProcessed: number;
    batchNumber: number;
    startTime?: Date; 
    endTime?: Date;   
  }