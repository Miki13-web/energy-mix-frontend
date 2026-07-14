import axios from 'axios';

// Adres backendu (port z Twojego screena)
const apiClient = axios.create({
  baseURL: 'http://localhost:5194/api/Energy',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Typowanie odpowiedzi zgodnie z naszymi DTO z C#
export interface FuelMixDto {
  fuel: string;
  percentage: number;
}

export interface DailyMixDto {
  date: string;
  mix: FuelMixDto[];
  cleanEnergyPercentage: number;
}

export interface OptimalWindowDto {
  startTime: string;
  endTime: string;
  cleanEnergyPercentage: number;
}

export const getThreeDaysMix = async (): Promise<DailyMixDto[]> => {
  const response = await apiClient.get<DailyMixDto[]>('/mix');
  return response.data;
};

export const getOptimalWindow = async (hours: number): Promise<OptimalWindowDto> => {
  const response = await apiClient.get<OptimalWindowDto>(`/optimal-window?hours=${hours}`);
  return response.data;
};