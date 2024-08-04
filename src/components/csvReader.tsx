import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Songs } from './songs.types';

export default function CsvReader() {
  const [data, setData] = useState<Songs[]>([]);

  useEffect(() => {
    Papa.parse('../../public/MostStreamedSpotifySongs2024.csv', {
      download: true,
      header: true,
      delimiter: ",",
      complete: (result) => {
          setData(result.data as Songs[]);
          console.log('Parsed Data:', result.data); 
      },
      error: (error) => {
        console.error('Ошибка при чтении CSV файла:', error);
      },
    });
  }, []);

  return data;
}
