import { Songs } from "./songs.types";


export default function cosSimilartity(songA: Songs, songB: Songs): number {
  const dotProduct = songA.Track_Score * songB.Track_Score +
  songA.Spotify_Streams * songB.Spotify_Streams +
  songA.Spotify_Playlist_Count * songB.Spotify_Playlist_Count +
  songA.Spotify_Playlist_Reach * songB.Spotify_Playlist_Reach +
  songA.Spotify_Popularity * songB.Spotify_Popularity;

  const magnitudeA = Math.sqrt(
  songA.Track_Score**2 +
  songA.Spotify_Streams**2 +
  songA.Spotify_Playlist_Count**2 +
  songA.Spotify_Playlist_Reach**2 +
  songA.Spotify_Popularity**2
  );

  const magnitudeB = Math.sqrt(
  songB.Track_Score**2 +
  songB.Spotify_Streams**2 +
  songB.Spotify_Playlist_Count**2 +
  songB.Spotify_Playlist_Reach**2 +
  songB.Spotify_Popularity**2
  );

  return dotProduct / (magnitudeA * magnitudeB);
}