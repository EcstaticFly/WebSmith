import React from "react";

const githubProfileLink = "https://github.com/EcstaticFly";
const linkedinProfileLink =  "https://www.linkedin.com/in/suyash-pandey-91bb40290/";

const Footer = () => {

  const handleLinkClick = (profile) => {
    if (profile.id === 1) {
      window.open(profile.link, "_blank");
    } else if (profile.id === 2) {
      window.open(profile.link, "_blank");
    }
  };

  return (
   <footer className="w-full mb-2 mt-8">

      <div className="flex md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Made with ❤️ by <span className="italic font-semibold">Suyash</span> © 2025
        </p>
        <div className="flex items-center md:gap-3 gap-6">
        <div
              className="size-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black rounded-lg border border-gray-400"
              key="github"
              onClick={() => window.open(githubProfileLink, "_blank")}
            >
              <img
                src="/git.svg"
                alt="Github"
                width={20}
                height={20}
              />
            </div>
            <div
              className="size-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black rounded-lg border border-gray-400"
              key="linkedin"
              onClick={() => window.open(linkedinProfileLink,"_blank")}
            >
              <img
                src="/link.svg"
                alt="linkedin"
                width={20}
                height={20}
              />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
