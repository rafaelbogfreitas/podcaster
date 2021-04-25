import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodesList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    playlist: (episodeList: Episode[], episodeIndex: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    playNext: () => void;
    playPrevious: () => void;
};

type PlayerContextProviderProps = {
    children: ReactNode;
};

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({
    children,
}: PlayerContextProviderProps) {
    const [episodesList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling,setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playlist(episodeList: Episode[], episodeIndex: number) {
        setEpisodeList(episodeList);
        setCurrentEpisodeIndex(episodeIndex);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }
    
    function toggleLoop() {
        setIsLooping(!isLooping);
    }
    
    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasNext = (currentEpisodeIndex + 1) < episodesList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext() {
        if(isShuffling) {
            const nextRandomIndex = Math.floor(Math.random() * episodesList.length)
            setCurrentEpisodeIndex(nextRandomIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodesList,
                currentEpisodeIndex,
                play,
                isPlaying,
                isLooping,
                isShuffling,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                setPlayingState,
                playlist,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);