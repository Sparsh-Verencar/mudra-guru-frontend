"use client";
import React from "react";
import CardNav from "@/components/ui/cardnav";
import { Vortex } from "@/components/ui/vortex";

export function homepage() {
  const items = [
    {
      label: "About",
      bgColor: "#660033",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company"},
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" , href: "mailto:mudraguru420@gmail.com?subject=Feedback&body=Hi%20MudraGuru%20team," },
        { label: "Twitter", ariaLabel: "Twitter" , href: "https://twitter.com/SparshVerencar" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" , href: "https://www.linkedin.com/in/balaji-kamat-496ab7341/" }
      ]
    }
  ];

  return (
    <div className="w-screen mx-auto rounded-md  h-screen overflow-hidden">
      <CardNav logo="/mudra-guru-logo.png" items = {items} />
      <Vortex
        backgroundColor="black"
        baseHue={300}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Keep forgetting your Mudras?
        </h2>
        
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Click on the
          <><span className="text-green-500"> green button.</span></>
        </p>

      </Vortex>
    </div>
  );
}

export default homepage