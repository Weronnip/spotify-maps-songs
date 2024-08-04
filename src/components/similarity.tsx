import { Songs } from "./songs.types";


export default function cosSimilartity(songA: Songs, songB: Songs): number {
    const vectorA = [
        songA.Spotify_Streams,
        songA.Spotify_Playlist_Count,
        songA.Spotify_Playlist_Reach,
        songA.Spotify_Popularity,
      ];
    
      const vectorB = [
        songB.Spotify_Streams,
        songB.Spotify_Playlist_Count,
        songB.Spotify_Playlist_Reach,
        songB.Spotify_Popularity,
      ];
    
      const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
      const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    
      return dotProduct / (magnitudeA * magnitudeB);
}