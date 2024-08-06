import { Songs } from "./songs.types";


function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) {
      matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
          if (a[i - 1] === b[j - 1]) {
              matrix[i][j] = matrix[i - 1][j - 1];
          } else {
              matrix[i][j] = Math.min(
                  matrix[i - 1][j] + 1,
                  matrix[i][j - 1] + 1,
                  matrix[i - 1][j - 1] + 1
              );
          }
      }
  }

  return matrix[a.length][b.length];
}

// Функция для расчета сходства двух песен на основе расстояния Левенштейна
export default function calcLevenshteinSimilarity(song1: Songs, song2: Songs): number {
  // Сравниваем названия треков и имена исполнителей
  const trackDistance = levenshteinDistance(song1.Track, song2.Track);
  const artistDistance = levenshteinDistance(song1.Artist, song2.Artist);

  // Общая длина строк для нормализации
  const totalLength = song1.Track.length + song2.Track.length + song1.Artist.length + song2.Artist.length;

  // Вычисляем нормализованное расстояние и затем сходство
  const normalizedDistance = (trackDistance + artistDistance) / totalLength;
  const similarity = 1 - normalizedDistance;

  return similarity;
}