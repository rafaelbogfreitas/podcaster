import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';
import convertDateToTimeString from '../../utils/convertDateToTimeString';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './episode.module.scss';

type EpisodeProps = {
    episode: Episode;
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

const Episode = ({ episode }: EpisodeProps) => {
    const router = useRouter();
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    objectFit="cover"
                    src={episode.thumbnail}
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const {data} = await api.get<Episode[]>('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc',
        }
    });

    const paths = data.map(episode => {
        return {
            params: {
                episodeName: episode.id,
            }
        }
    });

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { episodeName } = ctx.params;

    const { data } = await api.get<EpisodeFromApi>(`/episodes/${episodeName}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: ptBR,
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDateToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 * 30, // month
    };
};

export default Episode;
