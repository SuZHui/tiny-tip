import { ICatapultData } from '@/types/ICataoultData';

// Task queue
export type ITaskQueue = ITask[];
// Task function
export type ITask = (data: ICatapultData) => ICatapultData;
// Param of Task function
