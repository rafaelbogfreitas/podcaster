import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import convertDateToTimeString from '../utils/convertDateToTimeString';

import styles from './home.module.scss';

type HomeProps = {
    allEpisodes: Episode[];
    latestEpisodes: Episode[];
};

interface Episode {
    id: string;
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    description: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

interface EpisodeFromApi {
    id: string;
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    description: string;
    file: {
        url: string;
        type: string;
        duration: number;
    };
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
            <h2>Últimos lançamentos</h2>
                <ul>
                    {latestEpisodes.map((episode, i) => (
                        <li key={i}>
                            <Image
                                width={192}
                                height={192}
                                objectFit="contain"
                                src={episode.thumbnail}
                                alt={episode.title}
                            />
                            <div className={styles.episodeDetails}>
                                <a href="">{episode.title}</a>
                                <p>{episode.members}</p>
                                <span>{episode.publishedAt}</span>
                                <span>{episode.durationAsString}</span>
                            </div>

                            <button type="button">
                                <img src="/play-green.svg" alt="play button" />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.allEpisodes}>
                
            </section>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get<EpisodeFromApi[]>('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc',
        },
    });

    const episodes = data.map((episode) => {
        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
                locale: ptBR,
            }),
            duration: Number(episode.file.duration),
            durationAsString: convertDateToTimeString(
                Number(episode.file.duration)
            ),
            description: episode.description,
            url: episode.file.url,
        };
    });

    const latestEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);

    return {
        props: {
            allEpisodes,
            latestEpisodes,
        },
        revalidate: 60 * 60 * 8,
    };
};
