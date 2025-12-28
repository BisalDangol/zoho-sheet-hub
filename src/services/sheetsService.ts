const API_BASE_URL = 'http://localhost:3001/api';

export interface SheetData {
  data: any[];
  headers: string[];
}

export interface SheetMetadata {
  sheets: {
    title: string;
    sheetId: number;
    gridProperties: any;
  }[];
}

export class SheetsService {
  static async fetchSheetData(sheetId: string, range: string): Promise<SheetData> {
    try {
      const response = await fetch(`${API_BASE_URL}/sheets/${sheetId}/${range}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  static async fetchSheetMetadata(sheetId: string): Promise<SheetMetadata> {
    try {
      const response = await fetch(`${API_BASE_URL}/sheets/${sheetId}/metadata`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sheet metadata:', error);
      throw error;
    }
  }
}
