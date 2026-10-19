import type { NextConfig } from "next";
import { TRACK_HOME } from "./lib/tracks";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The DevOps landing page moved to the home page. Lessons and the other
      // pages under /devops keep their URLs, so only the exact path moves.
      {
        source: "/devops",
        destination: TRACK_HOME.devops,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
