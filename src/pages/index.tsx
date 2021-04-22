import {GetStaticProps} from "next";
import api from "../services/api";
import {format, parseISO} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

type HomeProps = {
  episodes: Array<{
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
  }>;
};

export default function Home({episodes}: HomeProps) {
  return (
    <>
      <div>Index</div>
      <main>{JSON.stringify(episodes)}</main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      ...episode,
      published_at: format(
        parseISO(episode.published_at),
        "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
    };
  });

  return {
    props: {
      episodes: episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
