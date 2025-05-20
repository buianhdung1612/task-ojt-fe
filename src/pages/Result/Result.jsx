import { useSearchParams } from "react-router-dom";
import { Title } from "../../components/Title/Title";

export const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');

  return (
    <>
      <Title title={`Results for “${keyword}”`} />
      <button className="px-4 py-1 rounded-full bg-gray-100 text-sm text-black font-medium mt-[10px] hover:bg-gray-200">
        Tasks
      </button>
    </>
  );
};