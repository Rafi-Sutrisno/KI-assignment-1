import Image from "next/image";

interface CardProps {
  fileType: string;
  fileID: string;
  handleDelete: (idFile: string) => void;
}

const Card: React.FC<CardProps> = ({ fileType, fileID, handleDelete }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-fit">
      <a href="#">
        <img
          className="rounded-t-lg"
          src="/docs/images/blog/image-1.jpg"
          alt=""
        />
      </a>
      <div className="p-5 flex flex-col justify-between">
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {fileID}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {fileType}
        </p>
        <div className="flex w-full justify-between">
          <a
            href="#"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Download
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          <Image
            src="/assets/delete.png"
            alt="Profile Picture"
            width={35}
            height={30}
            className="rounded-full p-2 hover:bg-red-200 cursor-pointer"
            onClick={() => {
              handleDelete(fileID);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
