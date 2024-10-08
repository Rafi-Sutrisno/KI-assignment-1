import Image from "next/image";

interface CardProps {
  fileType: string;
  fileID: string;
  fileName: String;
  handleDelete: (idFile: string) => void;
  handleDownload: (idFile: string, encType: string) => void;
}

const Card: React.FC<CardProps> = ({
  fileType,
  fileID,
  fileName,
  handleDelete,
  handleDownload,
}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-fit">
      <div className="p-5 flex flex-col justify-between">
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {fileName}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {fileType}
        </p>
        <div className="flex w-full justify-between gap-1">
          <a
            href="#"
            className="inline-flex items-center px-3 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              handleDownload(fileID, "des");
            }}
          >
            DES
            <img
              src="/assets/downloads.png"
              alt=""
              className="w-5 ml-4 filter invert"
            />
          </a>

          <a
            href="#"
            className="inline-flex items-center px-3 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              handleDownload(fileID, "aes");
            }}
          >
            AES
            <img
              src="/assets/downloads.png"
              alt=""
              className="w-5 ml-4 filter invert"
            />
          </a>

          <a
            href="#"
            className="inline-flex items-center px-3 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              handleDownload(fileID, "rc4");
            }}
          >
            RC4
            <img
              src="/assets/downloads.png"
              alt=""
              className="w-5 ml-4 filter invert"
            />
          </a>
          <Image
            src="/assets/delete.png"
            alt="delete file"
            width={45}
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
