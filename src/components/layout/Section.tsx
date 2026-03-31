import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Section = ({
  children,
  className = "",
}: SectionProps): React.ReactElement => {
  return <section className={`py-8 ${className}`}>{children}</section>;
};

export default Section;
