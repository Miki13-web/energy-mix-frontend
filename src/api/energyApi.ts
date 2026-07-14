import axios from 'axios';

const apiClient = axios.create({
    //both baseURL options 
  baseURL: import.meta.env.VITE_API_URL ?? 'https://energymix-api-5v57.onrender.com/api/Energy',
  //baseURL: 'http://localhost:5194/api/Energy',
});

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
  return response.data.slice(0, 3);
};

export const getOptimalWindow = async (hours: number): Promise<OptimalWindowDto> => {
  const response = await apiClient.get<OptimalWindowDto>(`/optimal-window?hours=${hours}`);
  return response.data;
};