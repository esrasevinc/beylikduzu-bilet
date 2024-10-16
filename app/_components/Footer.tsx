import React from "react";

const Footer = () => {
  return (
    <footer className="w-full  text-base flex relative  items-center justify-center text-center px-4 bg-black">
        <div className="flex flex-col gap-1 text-white py-4 text-sm">
            <p>Beylikdüzü Belediyesi Bilgi İşlem Müdürlüğü tarafından <span className="text-base">&#10084;</span> ile geliştirilmiştir.</p>
            <p>&copy;{new Date().getFullYear()} Tüm hakları saklıdır. </p>

        </div>
    </footer>
  );
};

export default Footer;