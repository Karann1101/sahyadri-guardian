const MONGODB_APP_ID = process.env.MONGODB_APP_ID;
const MONGODB_API_KEY = process.env.MONGODB_API_KEY;
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;

export async function connectToMongoDBAtlas() {
  if (!MONGODB_APP_ID || !MONGODB_API_KEY || !MONGODB_ENDPOINT) {
    throw new Error('MongoDB Atlas API credentials not configured');
  }

  const baseUrl = `https://data.mongodb-api.com/app/${MONGODB_APP_ID}/endpoint/${MONGODB_ENDPOINT}`;

  return {
    async findOne(collection: string, filter: any) {
      const response = await fetch(`${baseUrl}/action/findOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': MONGODB_API_KEY,
        },
        body: JSON.stringify({
          dataSource: 'Cluster0',
          database: 'sahyadri_guardian',
          collection,
          filter,
        }),
      });
      return response.json();
    },

    async insertOne(collection: string, document: any) {
      const response = await fetch(`${baseUrl}/action/insertOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': MONGODB_API_KEY,
        },
        body: JSON.stringify({
          dataSource: 'Cluster0',
          database: 'sahyadri_guardian',
          collection,
          document,
        }),
      });
      return response.json();
    },

    async find(collection: string, filter: any = {}) {
      const response = await fetch(`${baseUrl}/action/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': MONGODB_API_KEY,
        },
        body: JSON.stringify({
          dataSource: 'Cluster0',
          database: 'sahyadri_guardian',
          collection,
          filter,
        }),
      });
      return response.json();
    },
  };
} 