import Image from "@/components/ui/NextImage";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/404.svg"
            alt="404"
            loading="lazy"
            width={400}
            height={400}
          />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Looking for something?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re sorry. The Web address you entered is not a functioning
            page on our site.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-xs space-y-4">
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-2  border text-sm font-semibold rounded-md text-gray-900 bg-shop_dark_green/80 hover:bg-shop_dark_green focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-amazonOrangeDark hoverEffect"
            >
              Go to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
