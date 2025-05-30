import { useRouter } from "nextjs-toploader/app";
import { IconSkeleton, SearchSkeleton } from "../skeleton/skeletonAdmin";

const InputSearch = (props) => {
  const router = useRouter();
  const {
    rightButton,
    rightButtonClassName,
    onRightButtonCLick,
    createData,
    linkCreate,
    isLoading,
    classInput,
    ...rest
  } = props;

  return (
    <div
      className={`flex flex-wrap justify-between items-center gap-4 md:gap-6 w-full mb-4`}
    >
      <div className="flex flex-wrap gap-4">
        <div className={`flex gap-3 items-center`}>
          {isLoading ? (
            <SearchSkeleton />
          ) : (
            <input
              className={`px-4 py-2 md:px-5 md:py-3 h-[40px] md:h-[48px] w-[190px] md:w-[300px] text-gray-700 body-text-sm md:body-text-base font-nunito border border-gray-300 focus:outline-yellow-700 rounded-md shadow-sm ${classInput}`}
              {...rest}
            />
          )}
        </div>
        {rightButton &&
          (isLoading ? (
            <IconSkeleton />
          ) : (
            <button
              onClick={onRightButtonCLick}
              className="px-4 py-2 md:px-5 md:py-3 h-[40px] md:h-[48px] text-white bg-yellow-700 text-xl font-nunitoSans rounded-md shadow-md hover:bg-yellow-600 transition-all duration-300 cursor-pointer"
            >
              {rightButton}
            </button>
          ))}
      </div>

      {createData &&
        (isLoading ? (
          <IconSkeleton />
        ) : (
          <button
            className={` bg-yellow-700 text-white body-text-sm-bold font-nunitoSans px-4 py-2 md:px-5 md:py-3 rounded-md shadow-md hover:bg-yellow-700 transition-all duration-300 cursor-pointer`}
            onClick={() => router.push(linkCreate)}
          >
            {createData}
          </button>
        ))}
    </div>
  );
};

export default InputSearch;
