import { cn } from "@/lib/utils";

export const SignButton = ({
  link,
  className,
  preventClick,
}: {
  link: string;
  className?: string;
  preventClick?: boolean;
}) => {
  return (
    <div className="relative inline-flex items-center justify-center gap-4 group">
      <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-md blur-lg filter group-hover:opacity-100 group-hover:duration-200">
        {" "}
      </div>
      <a
        role="button"
        className={cn(
          "h-9 px-4 py-2 group relative inline-flex items-center justify-center text-base rounded-md font-semibold border border-gray-300 bg-white text-black transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30",
          className
        )}
        href={link}
        target={preventClick ? undefined : "_blank"}
      >
        {" "}
        Signer{" "}
        <svg
          viewBox="0 0 10 10"
          height="10"
          width="10"
          fill="none"
          className="mt-0.5 ml-2 -mr-1 stroke-black stroke-2"
        >
          <path
            d="M0 5h7"
            className="transition opacity-0 group-hover:opacity-100"
          >
            {" "}
          </path>
          <path
            d="M1 1l4 4-4 4"
            className="transition group-hover:translate-x-[3px]"
          >
            {" "}
          </path>
        </svg>
      </a>
    </div>
  );
};
