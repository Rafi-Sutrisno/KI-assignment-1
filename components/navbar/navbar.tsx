import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-20 top-0 start-0 border-b bg-white dark:bg-black">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src="/assets/bonfire.png"
            className="h-8"
            alt="Flowbite Logo"
            width={36}
            height={36}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            SmoothBrains
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link
            href={"/login"}
            className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Get Started
          </Link>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-red-500 rounded-lg md:hidden hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 dark:text-red-400 dark:hover:bg-red-700 dark:focus:ring-red-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
            <li>
              <Link
                href={"/"}
                className="block py-2 px-3 text-black rounded hover:bg-red-50 md:hover:bg-transparent md:hover:text-red-600 md:p-0 md:dark:hover:text-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-red-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/upload"}
                className="block py-2 px-3 text-black rounded hover:bg-red-50 md:hover:bg-transparent md:hover:text-red-600 md:p-0 md:dark:hover:text-red-500 dark:text-white dark:hover:bg-red-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-red-700"
              >
                Upload
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
