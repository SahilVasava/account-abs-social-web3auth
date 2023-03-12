import type { NextPage } from 'next';
import dynamic from "next/dynamic";

const App = dynamic(
  () => {
    return import("../components/W3Auth");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <App />;
}

export default Home