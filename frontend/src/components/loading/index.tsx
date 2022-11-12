import React from "react";
import Image from "next/image";

// @assets
import LoadingImage from "assets/gif/loading.gif";
import LoadingText from "assets/png/LoadingText.png";
// @styled-components
import { Layout } from "./styled";

//------------------------------------------------------

const Loading: React.FC = () => {
  return (
    <Layout>
      <Image src={LoadingImage} alt="No image" width={250} height={250} />
      <Image src={LoadingText} alt="No Text" width={250} height={100} />
    </Layout>
  );
};

export default Loading;
