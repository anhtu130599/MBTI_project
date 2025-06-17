// Re-export from infrastructure
import dbConnect, { connectToDatabase } from '@/core/infrastructure/database/mongodb';

export default dbConnect;
export { connectToDatabase }; 
