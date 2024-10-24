function Loading({ index }) {
  return (
    <div
      key={index}
      className={`${
        (index + 1) % 2 === 0
          ? "flex flex-col lg:flex-row-reverse my-14 w-full gap-10 items-center"
          : "flex lg:flex-row flex-col my-14 w-full gap-10 items-center"
      }`}
    >
      <div className="h-[50vh] lg:w-[50%] w-full overflow-hidden">
        <div
          role="status"
          className="flex items-center justify-center h-full w-[100%]  bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 lg:w-[50%] w-full">
        <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
          <div className="flex flex-col items-start gap-5 w-full">
            <div className="h-10 bg-gray-200 rounded-md dark:bg-gray-700 w-[200px]"></div>
            <div className="h-14  bg-gray-300 rounded dark:bg-gray-600 w-full"></div>
            <div className="h-7  bg-gray-300 rounded-md dark:bg-gray-600 w-24"></div>
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
